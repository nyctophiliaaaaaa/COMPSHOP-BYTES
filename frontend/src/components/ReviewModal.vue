<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
    isOpen: { type: Boolean, required: true },
    orderId: { type: [Number, String], required: false, default: null }
});

const emit = defineEmits(['close', 'reviewSubmitted']);

// --- STATE ---
const reviewForm = ref({ rating: 5, comment: '' });
const isSubmitting = ref(false);

// --- WATCHERS ---
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        reviewForm.value = { rating: 5, comment: '' };
        isSubmitting.value = false;
    }
});

// --- ACTIONS ---

// --- In ReviewModal.vue <script setup> ---

const submitReview = async () => {
    // Basic validation
    if (!reviewForm.value.comment || reviewForm.value.rating < 1) {
        alert("Please provide a rating and a comment.");
        return;
    }
    
const userIdRaw = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || "Anonymous User";
    
    // 2. CRITICAL FIX: Determine the payload userId
    let finalUserId = null;

    // Supabase Auth IDs are UUIDs (long strings). We check if the stored ID is valid.
    // If the raw ID is present AND looks like a UUID (long string), we use it.
    // Otherwise, we send null (for anonymous user or if '8' is still stored).
    if (userIdRaw && userIdRaw.length > 5) { 
        finalUserId = userIdRaw;
    } 
    // If the user is logged in, but the ID is "8" (the cause of the crash), we send null.
    
    isSubmitting.value = true;
    
    try {
        const payload = {
            // Send null if the ID is invalid/missing
            user_id: finalUserId, 
            order_id: props.orderId || null, 
            username: username,
            rating: reviewForm.value.rating,
            comment: reviewForm.value.comment
        };

        await axios.post('http://localhost:3000/api/reviews', payload);
        
        // Success logic
        alert("Thank you for answering the review! Your feedback is saved in the system. Have a great day! 👍"); 
        
        emit('reviewSubmitted');
        emit('close'); 

    } catch (e) {
        console.error("Review submission failed:", e);
        alert("Review Failed. Check your Node.js server console for the exact error.");
    } finally {
        isSubmitting.value = false;
    }
};

</script>

<template>
  <div v-if="isOpen" class="review-backdrop">
    <div class="review-modal">
        <h3>Leave Feedback {{ props.orderId ? `#${props.orderId}` : 'for the Service' }} 📝</h3>
        <div class="star-rating">
            <span v-for="n in 5" :key="n" 
                  @click="reviewForm.rating = n"
                  :class="{ 'filled': n <= reviewForm.rating }">★</span>
        </div>
        <textarea v-model="reviewForm.comment" placeholder="Tell us about your experience..." rows="3"></textarea>
        <div class="review-actions">
            <button @click="emit('close')" class="cancel-btn" :disabled="isSubmitting">Cancel</button>
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
</template>

<style scoped>
/* --- REVIEW MODAL STYLES (Existing) --- */
.review-backdrop { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.6); z-index: 20000; display:flex; justify-content:center; align-items:center; }
.review-modal { background: white; padding: 20px; border-radius: 12px; width: 90%; max-width: 320px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
.review-modal h3 { margin-top: 0; color: #333; }
.star-rating { font-size: 2rem; color: #ddd; cursor: pointer; margin-bottom: 10px; user-select: none; }
.star-rating span { transition: color 0.1s; }
.star-rating span:hover, .star-rating span.filled { color: #ffb400; }
.review-modal textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; resize: none; margin-bottom: 15px; font-family: inherit; }
.review-actions { display: flex; gap: 10px; justify-content: flex-end; }
.submit-btn { background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: opacity 0.2s; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.cancel-btn { background: #f3f4f6; color: #666; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
</style>