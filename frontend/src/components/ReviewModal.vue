<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router'; 
import axios from 'axios';
import { toast } from '@/utils/toast.js';

const router = useRouter(); 

const props = defineProps({
    isOpen: { type: Boolean, required: true },
    orderId: { type: [Number, String], required: false, default: null }
});

const emit = defineEmits(['close', 'reviewSubmitted']);

const reviewForm = ref({ rating: 0, comment: '' });
const isSubmitting = ref(false);
const hoverRating = ref(0);
const showSuccessPopup = ref(false);

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        reviewForm.value = { rating: 0, comment: '' };
        isSubmitting.value = false;
        showSuccessPopup.value = false;
    }
});

const closeSuccessPopup = async () => {
    showSuccessPopup.value = false;
    emit('close'); 
    
};

const submitReview = async () => {
    if (!reviewForm.value.comment || reviewForm.value.rating < 1) {
        toast('Please provide a rating and a comment.', { type: 'warning' });
        return;
    }
    
    const userIdRaw = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || "Anonymous User";
    
    let finalUserId = null;
    if (userIdRaw && userIdRaw.length > 5) { 
        finalUserId = userIdRaw;
    } 
    
    isSubmitting.value = true;
    
    try {
        const payload = {
            user_id: finalUserId, 
            order_id: props.orderId || null, 
            username: username,
            rating: reviewForm.value.rating,
            comment: reviewForm.value.comment
        };

        await axios.post('http://localhost:3000/api/reviews', payload);
        
        emit('reviewSubmitted');
        
        showSuccessPopup.value = true;

    } catch (e) {
        console.error("Review submission failed:", e);
        toast('Review Failed. Check console.', { type: 'error' });
    } finally {
        isSubmitting.value = false;
    }
};

const handleCancel = async () => {
    if (reviewForm.value.comment.trim()) {
        if (window.confirm('Discard review?')) {
            emit('close');
        }
    } else {
        emit('close');
    }
};
</script>

<template>
  <div v-if="isOpen && !showSuccessPopup" class="review-backdrop">
    <div class="review-modal">
        <h3>Leave Feedback {{ props.orderId ? `#${props.orderId}` : 'for the Service' }} 📝</h3>
        
        <div class="star-rating">
            <span v-for="n in 5" :key="n" 
                  @click="reviewForm.rating = n"
                  @mouseenter="hoverRating = n"
                  @mouseleave="hoverRating = 0"
                  :class="{ 'filled': n <= (hoverRating || reviewForm.rating) }">★</span>
        </div>
        
        <p class="rating-label">
            {{ reviewForm.rating > 0 ? `${reviewForm.rating} Star${reviewForm.rating !== 1 ? 's' : ''}` : 'Select a rating' }}
        </p>
        
        <textarea v-model="reviewForm.comment" placeholder="Tell us about your experience..." rows="3"></textarea>
        
        <div class="review-actions">
            <button @click="handleCancel" class="cancel-btn" :disabled="isSubmitting">Cancel</button>
            <button 
                @click="submitReview" 
                :disabled="isSubmitting || !reviewForm.comment || reviewForm.rating === 0" 
                class="submit-btn"
            >
                {{ isSubmitting ? 'Sending...' : 'Submit Review' }}
            </button>
        </div>
    </div>
  </div>

  <div v-if="showSuccessPopup" class="success-backdrop">
    <div class="success-popup">
        <button @click="closeSuccessPopup" class="close-x">×</button>
        
        <div class="success-icon">✓</div>
        <h2>Review Submitted Successfully</h2>
        <p>Thank you for answering the review! Your feedback is saved in the system. Have a great day! 👍</p>
    </div>
  </div>
</template>

<style scoped>
.review-backdrop { 
    position: fixed; top:0; left:0; width:100%; height:100%; 
    background: rgba(0,0,0,0.6); z-index: 20000; 
    display:flex; justify-content:center; align-items:center; 
}
.review-modal { 
    background: white; padding: 20px; border-radius: 12px; 
    width: 90%; max-width: 320px; text-align: center; 
    box-shadow: 0 10px 25px rgba(0,0,0,0.2); 
}
.review-modal h3 { margin-top: 0; color: #333; }
.star-rating { font-size: 2rem; color: #ddd; cursor: pointer; margin-bottom: 5px; user-select: none; }
.star-rating span { transition: color 0.1s; }
.star-rating span:hover, .star-rating span.filled { color: #ffb400; }
.rating-label { font-size: 0.9rem; color: #666; margin-bottom: 10px; font-weight: 500; }
.review-modal textarea { 
    width: 100%; padding: 10px; border: 1px solid #ddd; 
    border-radius: 6px; resize: none; margin-bottom: 15px; 
    font-family: inherit; 
}
.review-actions { display: flex; gap: 10px; justify-content: flex-end; }
.submit-btn { 
    background: #10b981; color: white; border: none; 
    padding: 8px 16px; border-radius: 6px; cursor: pointer; 
    font-weight: bold; transition: opacity 0.2s; 
}
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.cancel-btn { 
    background: #f3f4f6; color: #666; border: none; 
    padding: 8px 16px; border-radius: 6px; cursor: pointer; 
}

.success-backdrop { 
    position: fixed; top:0; left:0; width:100%; height:100%; 
    background: rgba(0,0,0,0.7); z-index: 21000; 
    display:flex; justify-content:center; align-items:center; 
}

.success-popup { 
    background: white; padding: 40px 30px 30px 30px; 
    border-radius: 16px; width: 90%; max-width: 400px; 
    text-align: center; box-shadow: 0 15px 40px rgba(0,0,0,0.3); 
    position: relative; 
}

.close-x { 
    position: absolute; 
    top: 15px;    
    right: 15px;  
    background: transparent; 
    border: none; 
    font-size: 28px; 
    color: #999; 
    cursor: pointer; 
    padding: 0; 
    line-height: 1; 
    width: 30px; 
    height: 30px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    transition: color 0.2s;
    z-index: 10;
}
.close-x:hover { color: #333; }

.success-icon { 
    width: 80px; height: 80px; background: #10b981; 
    border-radius: 50%; display: flex; align-items: center; 
    justify-content: center; font-size: 40px; color: white; 
    margin: 0 auto 20px; font-weight: bold; 
}
.success-popup h2 { margin: 0 0 15px 0; color: #333; font-size: 24px; }
.success-popup p { color: #666; font-size: 16px; line-height: 1.5; margin: 0; }
</style>