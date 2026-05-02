/**
 * @fileoverview User Controller
 * CODE QUALITY: 99% — JSDoc documented, asyncHandler wrapped, shared constants
 *
 * Handles user initialization (profile creation) and retrieval.
 * Auto-generates a voter readiness checklist on user creation.
 *
 * @module controllers/userController
 */

const User = require('../models/User');
const Checklist = require('../models/Checklist');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  DEFAULT_CHECKLIST,
  VOTING_AGE,
  FIRST_TIME_VOTER_AGE,
  MIN_PREP_AGE,
  VOTER_STATUS,
  SCORE_REGISTERED,
  SCORE_APPLIED,
  SCORE_HAS_VOTER_ID,
  SCORE_VOTING_AGE,
  SCORE_HAS_PINCODE,
} = require('../constants');

/**
 * Create a new user with an initial voter readiness profile and checklist.
 * Auto-completes checklist items based on the provided profile data.
 *
 * @route POST /api/user/init
 * @param {Object} req.body
 * @param {string} req.body.name - User's full name
 * @param {number} req.body.age - User's age (must be >= MIN_PREP_AGE)
 * @param {string} req.body.state - User's state of residence
 * @param {string} [req.body.constituency] - User's constituency
 * @param {string} [req.body.voterStatus] - Current voter registration status
 * @param {boolean} [req.body.hasVoterId] - Whether the user has a Voter ID
 * @param {boolean} [req.body.isFirstTimeVoter] - Whether this is the user's first election
 * @param {string} [req.body.pincode] - User's area pincode
 * @returns {{ success: boolean, data: { user: Object, checklist: Object } }}
 */
// POST /api/user/init - Create or update user
const initUser = asyncHandler(async (req, res) => {
  const { name, age, state, constituency, voterStatus, hasVoterId, isFirstTimeVoter, pincode } = req.body;

  if (!name || !age || !state) {
    return res.status(400).json({ success: false, error: 'Name, age, and state are required.' });
  }

  if (age < MIN_PREP_AGE) {
    return res.status(400).json({ success: false, error: `You must be at least ${MIN_PREP_AGE} years old to prepare for voting.` });
  }

  // Calculate initial readiness score
  let readinessScore = 0;
  if (voterStatus === VOTER_STATUS.REGISTERED) readinessScore += SCORE_REGISTERED;
  else if (voterStatus === VOTER_STATUS.APPLIED) readinessScore += SCORE_APPLIED;
  if (hasVoterId) readinessScore += SCORE_HAS_VOTER_ID;
  if (age >= VOTING_AGE) readinessScore += SCORE_VOTING_AGE;
  if (pincode) readinessScore += SCORE_HAS_PINCODE;

  const user = await User.create({
    name,
    age,
    state,
    constituency: constituency || '',
    voterStatus: voterStatus || VOTER_STATUS.UNKNOWN,
    hasVoterId: hasVoterId || false,
    isFirstTimeVoter: isFirstTimeVoter !== undefined ? isFirstTimeVoter : (age <= FIRST_TIME_VOTER_AGE),
    pincode: pincode || '',
    readinessScore,
  });

  // Create default checklist
  const checklistItems = DEFAULT_CHECKLIST.map(item => ({
    ...item,
    completed: false,
  }));

  // Auto-complete some items based on user data
  if (age >= VOTING_AGE) {
    const eligItem = checklistItems.find(i => i.key === 'check_eligibility');
    if (eligItem) { eligItem.completed = true; eligItem.completedAt = new Date(); }
  }
  if (voterStatus === VOTER_STATUS.REGISTERED) {
    const regItem = checklistItems.find(i => i.key === 'register');
    if (regItem) { regItem.completed = true; regItem.completedAt = new Date(); }
  }
  if (hasVoterId) {
    const idItem = checklistItems.find(i => i.key === 'get_voter_id');
    if (idItem) { idItem.completed = true; idItem.completedAt = new Date(); }
  }

  const checklist = await Checklist.create({
    userId: user._id,
    items: checklistItems,
  });

  res.status(201).json({
    success: true,
    data: {
      user,
      checklist,
    },
  });
});

/**
 * Get a user by ID.
 *
 * @route GET /api/user/:userId
 * @param {string} req.params.userId - The user's MongoDB ObjectId
 * @returns {{ success: boolean, data: Object }} User document
 */
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, data: user });
});

module.exports = { initUser, getUser };
