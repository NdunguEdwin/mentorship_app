// routes/domains.js
import express from 'express';
import DomainLog from '../models/DomainLog.js';
const router = express.Router();

router.get('/search', async (req, res) => {
  const { domain } = req.query;
  try {
    // Log the access
    await DomainLog.create({
      domain: domain,
      userId: req.user?._id, // assuming auth middleware adds user
    });

    // Simulate a query (replace with actual logic)
    const result = { domain: domain, data: "Sample Data" };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to log domain access" });
  }
});

export default router;
