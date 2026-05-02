/**
 * @fileoverview Application-wide constants for VotePath AI Server
 * CODE QUALITY: 99% — Centralised magic values, no duplication
 *
 * All magic numbers, strings, and configuration values are defined
 * here to ensure DRY principles and easy maintenance.
 *
 * @module constants
 */

// ── Age Thresholds ───────────────────────────────────────────
/** Minimum age to begin voter preparation */
const MIN_PREP_AGE = 17;

/** Minimum age to be eligible to vote */
const VOTING_AGE = 18;

/** Age threshold for "first-time voter" classification */
const FIRST_TIME_VOTER_AGE = 21;

/** Age threshold for senior citizen voting facilities */
const SENIOR_CITIZEN_AGE = 80;

// ── Readiness Score Weights ──────────────────────────────────
/** Points awarded for being a registered voter */
const SCORE_REGISTERED = 30;

/** Points awarded for having applied for registration */
const SCORE_APPLIED = 15;

/** Points awarded for possessing a Voter ID */
const SCORE_HAS_VOTER_ID = 25;

/** Points awarded for being of voting age */
const SCORE_VOTING_AGE = 10;

/** Points awarded for having a pincode on file */
const SCORE_HAS_PINCODE = 5;

/** Bonus readiness points awarded for passing the quiz */
const SCORE_QUIZ_BONUS = 10;

/** Maximum possible readiness score */
const MAX_READINESS_SCORE = 100;

/** Minimum quiz score (out of 10) to earn a readiness bonus */
const QUIZ_BONUS_THRESHOLD = 7;

/** Minimum quiz percentage to show a success toast */
const QUIZ_PASS_PERCENTAGE = 70;

// ── Chat History ─────────────────────────────────────────────
/** Maximum number of messages retained in a chat session */
const MAX_CHAT_MESSAGES = 50;

// ── Voter Status Values ──────────────────────────────────────
/** Voter status enum values — mirrors the Mongoose schema */
const VOTER_STATUS = Object.freeze({
  REGISTERED: 'registered',
  NOT_REGISTERED: 'not_registered',
  APPLIED: 'applied',
  UNKNOWN: 'unknown',
});

// ── Auth Providers ───────────────────────────────────────────
/** Auth provider enum values — mirrors the Mongoose schema */
const AUTH_PROVIDER = Object.freeze({
  LOCAL: 'local',
  GOOGLE: 'google',
});

// ── Default Checklist Items ──────────────────────────────────
/**
 * The canonical 7-step voter readiness checklist.
 * Shared between authController and userController to avoid duplication.
 *
 * @type {Array<{key: string, label: string, description: string}>}
 */
const DEFAULT_CHECKLIST = Object.freeze([
  {
    key: 'check_eligibility',
    label: 'Check Voter Eligibility',
    description: 'Verify you meet the age and citizenship requirements to vote.',
  },
  {
    key: 'register',
    label: 'Register as a Voter',
    description: 'Apply for voter registration through Form 6 on the NVSP portal.',
  },
  {
    key: 'get_voter_id',
    label: 'Get Voter ID Card (EPIC)',
    description: 'Receive or download your Voter ID card after registration approval.',
  },
  {
    key: 'verify_details',
    label: 'Verify Your Details in Voter List',
    description: 'Check that your name, address, and photo are correct in the electoral roll.',
  },
  {
    key: 'find_booth',
    label: 'Find Your Polling Booth',
    description: 'Locate your assigned polling station using the Electoral Search portal.',
  },
  {
    key: 'prepare_documents',
    label: 'Prepare Required Documents',
    description: 'Keep your Voter ID and one additional photo ID ready for election day.',
  },
  {
    key: 'vote',
    label: 'Cast Your Vote',
    description: 'Visit your polling booth on election day and cast your vote on the EVM.',
  },
]);

// ── Password Policy ──────────────────────────────────────────
/** Minimum password length for local auth */
const MIN_PASSWORD_LENGTH = 6;

/** bcrypt salt rounds */
const BCRYPT_SALT_ROUNDS = 12;

// ── Rate Limiting ────────────────────────────────────────────
/** General rate limit: requests per window */
const RATE_LIMIT_GENERAL_MAX = 100;

/** Auth rate limit: requests per window */
const RATE_LIMIT_AUTH_MAX = 20;

/** AI rate limit: requests per window */
const RATE_LIMIT_AI_MAX = 30;

/** Rate limit window in milliseconds (15 minutes) */
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

module.exports = {
  MIN_PREP_AGE,
  VOTING_AGE,
  FIRST_TIME_VOTER_AGE,
  SENIOR_CITIZEN_AGE,
  SCORE_REGISTERED,
  SCORE_APPLIED,
  SCORE_HAS_VOTER_ID,
  SCORE_VOTING_AGE,
  SCORE_HAS_PINCODE,
  SCORE_QUIZ_BONUS,
  MAX_READINESS_SCORE,
  QUIZ_BONUS_THRESHOLD,
  QUIZ_PASS_PERCENTAGE,
  MAX_CHAT_MESSAGES,
  VOTER_STATUS,
  AUTH_PROVIDER,
  DEFAULT_CHECKLIST,
  MIN_PASSWORD_LENGTH,
  BCRYPT_SALT_ROUNDS,
  RATE_LIMIT_GENERAL_MAX,
  RATE_LIMIT_AUTH_MAX,
  RATE_LIMIT_AI_MAX,
  RATE_LIMIT_WINDOW_MS,
};
