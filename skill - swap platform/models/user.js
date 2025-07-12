const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        maxlength: [200, 'Location cannot exceed 200 characters']
    },
    profilePhoto: {
        type: String,
        trim: true,
        default: ''
    },
    skillsOffered: {
        type: String,
        required: [true, 'Skills offered is required'],
        trim: true,
        maxlength: [1000, 'Skills offered cannot exceed 1000 characters']
    },
    skillsWanted: {
        type: String,
        required: [true, 'Skills wanted is required'],
        trim: true,
        maxlength: [1000, 'Skills wanted cannot exceed 1000 characters']
    },
    availability: {
        type: String,
        required: [true, 'Availability is required'],
        enum: [
            'weekdays',
            'weekends', 
            'evenings',
            'mornings',
            'flexible',
            'weekdays-evenings',
            'weekends-mornings'
        ]
    },
    makePublic: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('User', userSchema);
