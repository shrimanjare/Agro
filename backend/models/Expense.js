import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Expense title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Rent', 'Salary', 'Electricity', 'Internet', 'Maintenance', 'Marketing', 'Other']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPeriod: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    required: function() { return this.isRecurring; }
  }
}, {
  timestamps: true
});

export default mongoose.model('Expense', expenseSchema);