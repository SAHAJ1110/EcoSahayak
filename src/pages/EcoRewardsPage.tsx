import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { INITIAL_USERS } from '../data/mockData';
import {
  Award,
  Sparkles,
  Shield,
  Medal,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Zap,
  Leaf
} from 'lucide-react';

export const EcoRewardsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { rewardHistory } = useComplaints();

  const points = currentUser?.ecoPoints || 0;

  // Trigger celebratory confetti on high points
  useEffect(() => {
    if (points >= 300) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3E7C4A', '#F2A900', '#244D30', '#FFF8E7'],
      });
    }
  }, [points]);

  // Badge tier rules
  const badges = [
    {
      level: 'Eco Starter',
      pointsRequired: 0,
      icon: <Leaf className="w-8 h-8 text-[#3E7C4A]" />,
      description: 'Awarded upon creating your EcoSahayak citizen account and filing your first complaint.',
      unlocked: points >= 0,
      color: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    },
    {
      level: 'Eco Warrior',
      pointsRequired: 100,
      icon: <Shield className="w-8 h-8 text-[#3E7C4A]" />,
      description: 'Awarded when municipal engineers verify and resolve your first 1-2 reported civic hazards.',
      unlocked: points >= 100,
      color: 'bg-[#EAF2E8] border-[#3E7C4A]/40 text-[#244D30]',
    },
    {
      level: 'Green Guardian',
      pointsRequired: 300,
      icon: <Medal className="w-8 h-8 text-[#F2A900]" />,
      description: 'Active community leader with multiple verified critical hazard rectifications.',
      unlocked: points >= 300,
      color: 'bg-[#FFF8E7] border-[#F2A900]/40 text-[#B87A00]',
    },
    {
      level: 'Eco Hero',
      pointsRequired: 600,
      icon: <Award className="w-8 h-8 text-[#F2A900]" />,
      description: 'Elite civic champion honored for transforming public safety and sanitation across sectors.',
      unlocked: points >= 600,
      color: 'bg-amber-100 border-amber-400 text-amber-900',
    },
  ];

  // Calculate progress to next tier
  let nextTier = badges.find(b => b.pointsRequired > points);
  let progressPercent = 100;
  if (nextTier) {
    const prevRequired = badges[badges.indexOf(nextTier) - 1]?.pointsRequired || 0;
    progressPercent = Math.min(
      100,
      Math.round(((points - prevRequired) / (nextTier.pointsRequired - prevRequired)) * 100)
    );
  }

  // Filter reward transactions for current user
  const userRewards = rewardHistory.filter(
    r => currentUser?.role === 'admin' || r.userId === currentUser?.id
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#B87A00] text-xs font-semibold border border-[#F2A900]/40">
          <Award className="w-3.5 h-3.5 text-[#F2A900]" />
          <span>Civic Gamification & Verified Impact</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-[#244D30]">
          Eco Rewards & Citizen Badges
        </h1>
        <p className="text-xs sm:text-sm text-[#29332B]/80 font-sans max-w-2xl">
          We believe civic vigilance deserves recognition. Points are awarded exclusively after municipal officers
          physically inspect and verify the resolution of your filed community hazard.
        </p>
      </div>

      {/* Tally & Level Status Card */}
      <div className="bg-gradient-to-br from-[#244D30] to-[#1A3823] rounded-3xl p-6 sm:p-8 text-[#FFF8E7] shadow-xl border border-[#3E7C4A]/40 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2A900] animate-ping" />
            <span className="text-xs font-semibold text-[#F2A900] uppercase tracking-wider font-heading">
              Current Citizen Status
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-heading font-extrabold text-white">
              {points}
            </span>
            <span className="text-sm font-sans text-[#FFF8E7]/80">Verified Eco-Points</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#3E7C4A] text-white text-xs font-heading font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-[#F2A900]" />
            <span>Badge Tier: {currentUser?.badgeLevel || 'Eco Starter'}</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-[#FFF8E7]/80 font-sans">
              <span>{nextTier ? `Next: ${nextTier.level} (${nextTier.pointsRequired} pts)` : 'Maximum Tier Achieved!'}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-[#F2A900] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Rule Card */}
        <div className="md:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3 text-xs font-sans">
          <h4 className="font-heading font-bold text-sm text-[#F2A900] flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>Anti-Fraud Point Rules</span>
          </h4>
          <ul className="space-y-2 text-[#FFF8E7]/90 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F2A900] shrink-0 mt-0.5" />
              <span><b>50 Points:</b> Verified resolution of routine garbage or streetlight issues.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F2A900] shrink-0 mt-0.5" />
              <span><b>100 Points:</b> Verified resolution of High/Critical hazards (water bursts, craters, sewage).</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F2A900] shrink-0 mt-0.5" />
              <span>Points are credited only once per ticket upon official nodal officer sign-off.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-bold text-[#244D30]">
          Citizen Achievement Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map(badge => (
            <div
              key={badge.level}
              className={`rounded-2xl p-6 border transition-all ${
                badge.unlocked
                  ? `${badge.color} shadow-md`
                  : 'bg-gray-50 border-gray-200 opacity-60 text-gray-500'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center border border-gray-100">
                  {badge.icon}
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/80">
                  {badge.pointsRequired} pts
                </span>
              </div>

              <h3 className="font-heading font-bold text-base mb-1">{badge.level}</h3>
              <p className="text-xs font-sans leading-relaxed mb-4">{badge.description}</p>

              <div>
                {badge.unlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3E7C4A]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Badge Unlocked</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Locked ({badge.pointsRequired - points} pts to go)</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified History & Community Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Reward Transactions History */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-[#3E7C4A]/20 space-y-4">
          <h2 className="text-lg font-heading font-bold text-[#244D30] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F2A900]" />
            <span>Verified Points Credit History</span>
          </h2>

          {userRewards.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#29332B]/70 font-sans space-y-1">
              <Clock className="w-6 h-6 text-gray-400 mx-auto" />
              <p>No verified reward points yet. When municipal officers resolve your reports, points appear here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userRewards.map(r => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl bg-[#FFF8E7]/40 border border-[#F2A900]/30 flex items-center justify-between text-xs font-sans"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#3E7C4A]">{r.trackingId}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[#29332B] font-medium">{r.reason}</p>
                    <p className="text-[10px] text-gray-500">Verified by: {r.awardedBy}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-extrabold text-sm text-[#3E7C4A] bg-[#EAF2E8] px-2.5 py-1 rounded-lg border border-[#3E7C4A]/30">
                      +{r.points} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Community Leaderboard */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-[#3E7C4A]/20 space-y-4">
          <h2 className="text-lg font-heading font-bold text-[#244D30] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#3E7C4A]" />
            <span>Ward Community Leaderboard</span>
          </h2>

          <div className="space-y-2">
            {INITIAL_USERS.map((user, idx) => (
              <div
                key={user.id}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-sans ${
                  currentUser?.id === user.id
                    ? 'bg-[#EAF2E8] border-[#3E7C4A] font-semibold'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      idx === 0
                        ? 'bg-[#F2A900] text-[#244D30]'
                        : idx === 1
                        ? 'bg-gray-300 text-gray-800'
                        : 'bg-[#3E7C4A] text-white'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="text-[#244D30]">{user.fullName}</div>
                    <div className="text-[10px] text-gray-500">{user.badgeLevel}</div>
                  </div>
                </div>
                <div className="font-heading font-bold text-sm text-[#244D30]">
                  {user.id === currentUser?.id ? points : user.ecoPoints} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
