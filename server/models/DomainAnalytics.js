import mongoose from "mongoose";

const DomainAnalyticsSchema = new mongoose.Schema({
  domain: { type: String, required: true },       // e.g. "Technology"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who queried
  timestamp: { type: Date, default: Date.now },   // when queried
});

const DomainAnalytics = mongoose.model("DomainAnalytics", DomainAnalyticsSchema);

export default DomainAnalytics;
