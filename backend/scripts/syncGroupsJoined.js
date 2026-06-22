const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const StudyGroup = require('../models/StudyGroup');
const User = require('../models/User');

const syncGroupsJoined = async () => {
  await connectDB();

  const clearResult = await User.updateMany({}, { $set: { groupsJoined: [] } });
  let groupsScanned = 0;
  let membershipLinksRestored = 0;

  const cursor = StudyGroup.find().select('_id members').lean().cursor();

  for await (const group of cursor) {
    groupsScanned += 1;
    const memberIds = [...new Set((group.members || []).map((memberId) => memberId.toString()))];
    if (memberIds.length === 0) continue;

    const restoreResult = await User.updateMany(
      { _id: { $in: memberIds } },
      { $addToSet: { groupsJoined: group._id } }
    );
    membershipLinksRestored += restoreResult.modifiedCount || 0;
  }

  console.log(`Users cleared: ${clearResult.modifiedCount || 0}`);
  console.log(`Groups scanned: ${groupsScanned}`);
  console.log(`Membership links restored: ${membershipLinksRestored}`);
};

syncGroupsJoined()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Failed to sync groupsJoined:', error);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  });
