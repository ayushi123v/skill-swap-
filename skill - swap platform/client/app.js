document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profileForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const profileData = {
            name: formData.get('name'),
            location: formData.get('location'),
            profilePhoto: formData.get('profilePhoto'),
            skillsOffered: formData.get('skillsOffered'),
            skillsWanted: formData.get('skillsWanted'),
            availability: formData.get('availability'),
            makePublic: formData.get('makePublic') === 'on'
        };
        
        // Validate required fields
        if (!profileData.name || !profileData.location || !profileData.skillsOffered || !profileData.skillsWanted || !profileData.availability) {
            showMessage('Please fill in all required fields marked with *', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Profile...';
        submitBtn.disabled = true;
        
        try {
            // Send data to backend
            const response = await fetch('/create-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Show success message
            showMessage('Profile created successfully!', 'success');
            
            // Log the response from server
            console.log('Server Response:', result);
            
            // Optional: Reset form after successful submission
            // form.reset();
            
        } catch (error) {
            console.error('Error creating profile:', error);
            showMessage(`Failed to create profile: ${error.message}`, 'error');
        } finally {
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Add real-time validation for profile photo URL
    const profilePhotoInput = document.getElementById('profilePhoto');
    profilePhotoInput.addEventListener('blur', function() {
        const url = this.value.trim();
        if (url && !isValidUrl(url)) {
            showMessage('Please enter a valid URL for your profile photo', 'error');
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#e1e5e9';
        }
    });
    
    // Function to validate URL
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    // Function to show messages
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            padding: 12px 16px;
            margin: 10px 0;
            border-radius: 8px;
            font-weight: 500;
            text-align: center;
            animation: slideIn 0.3s ease;
        `;
        
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';
        } else {
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
        }
        
        // Insert message before the form
        form.parentNode.insertBefore(messageDiv, form);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    // Add animation for message
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
});
