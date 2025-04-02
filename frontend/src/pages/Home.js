import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import LotteryCard from '../components/LotteryCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        const res = await axios.get('/api/lotteries');
        setLotteries(res.data);
      } catch (err) {
        console.error('Failed to fetch lotteries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLotteries();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to DreamLottery</h1>
          {user && (
            <p className="text-lg text-gray-600 mt-2">
              Your current balance: ₹{user.balance || 0}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {lotteries.map((lottery) => (
            <LotteryCard key={lottery._id} lottery={lottery} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;