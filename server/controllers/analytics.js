import DomainAnalytics from "../models/DomainAnalytics.js";

export const queryDomain = async (req, res) => {
  try {
    const { domain } = req.body;
    const userId = req.user.id;

    const log = new DomainAnalytics({ domain, userId });
    await log.save();

    res.status(200).json({ message: "Domain access logged successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
