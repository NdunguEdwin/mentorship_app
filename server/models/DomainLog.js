import mongoose from "mongoose";

const domainLogSchema = new mongoose.Schema({
  domainQueried: String,
  userId: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: String,
});

const DomainLog = mongoose.model("DomainLog", domainLogSchema);

export default DomainLog;
