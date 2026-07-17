import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio, Heart, Users, Globe, TrendingUp, PlayCircle } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Radio,
      title: 'Live Streaming',
      description: 'Watch services live from anywhere in the world with real-time interaction',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Global Community',
      description: 'Connect with millions of believers across all continents',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Prayer Wall',
      description: 'Share prayer requests and intercede for others',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: '2 Billion Goal',
      description: 'Join us in discipling 2 billion souls by 2033',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { value: '2B', label: 'Target Souls by 2033' },
    { value: '150+', label: 'Countries' },
    { value: '24/7', label: 'Live Services' },
    { value: '100K+', label: 'Active Members' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Now - Join 2,845 Viewers</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Christ Revolution
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400">
                Movement
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
              Disciple 2 Billion Souls by 2033
            </p>
            
            <p className="text-lg text-red-200 mb-10 max-w-2xl mx-auto">
              A global Pentecostal, Evangelical, and Charismatic movement bringing the Gospel 
              to every nation through the power of digital discipleship.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/live"
                className="group w-full sm:w-auto px-8 py-4 bg-white text-red-600 rounded-full font-semibold text-lg hover:bg-red-50 transition flex items-center justify-center space-x-2"
              >
                <Radio className="w-5 h-5 group-hover:animate-pulse" />
                <span>Watch Live</span>
              </Link>
              
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-red-800 text-white rounded-full font-semibold text-lg hover:bg-red-900 transition border-2 border-white/20"
              >
                Join the Movement
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Join CRM?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience a new way of worship, learning, and community that transcends borders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <TrendingUp className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Make History?
            </h2>
            
            <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
              Join thousands of believers worldwide in the greatest commission of our generation. 
              Together, we can reach 2 billion souls by 2033.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-red-600 rounded-full font-semibold text-lg hover:bg-red-50 transition"
            >
              <span>Start Your Journey</span>
              <PlayCircle className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
