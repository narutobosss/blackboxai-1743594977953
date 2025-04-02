import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LotteryCard = ({ lottery }) => {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const hasJoined = user?.lotteryEntries?.includes(lottery._id);

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      setError(null);
      const res = await axios.post('/api/join', { lotteryId: lottery._id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess(`Successfully joined ${lottery.name}!`);
      // Update user context or trigger refresh
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join lottery');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img 
        className="w-full h-48 object-cover" 
        src={`https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940&lottery=${lottery._id}`} 
        alt="Lottery" 
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{lottery.name}</div>
        <p className="text-gray-700 text-base">
          Entry Price: ₹{lottery.cost}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          {lottery.participants?.length || 0} participants
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {error && (
          <div className="text-red-500 text-sm mb-2">{error}</div>
        )}
        {success && (
          <div className="text-green-500 text-sm mb-2">{success}</div>
        )}
        {hasJoined ? (
          <span className="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-700 mr-2 mb-2">
            Joined
          </span>
        ) : (
          <button
            onClick={handleJoin}
            disabled={isJoining || !user}
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 
              ${isJoining ? 'bg-gray-300 text-gray-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
          >
            {isJoining ? 'Joining...' : 'Join Now'}
          </button>
        )}
      </div>
    </div>
  );
};

export default LotteryCard;