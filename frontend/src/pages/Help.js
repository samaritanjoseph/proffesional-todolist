import React from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  ArrowRight,
  Shield,
  Zap,
  Users,
  Layout as LayoutIcon
} from 'lucide-react';
import Layout from '../components/Layout';

const FAQItem = ({ question, answer }) => {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all">
      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
        {question}
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed">{answer}</p>
    </div>
  );
};

const Help = () => {
  return (
    <Layout>
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block p-3 bg-indigo-600/10 rounded-2xl text-indigo-500 mb-6">
          <HelpCircle size={32} />
        </motion.div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-3">How can we help?</h1>
        <p className="text-slate-400">Everything you need to know about the Task Manager. Explore our guides and FAQs below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { title: 'Getting Started', icon: Zap, desc: 'New here? Learn the basics in 5 minutes.', color: 'text-amber-500' },
          { title: 'Collaboration', icon: Users, desc: 'How to manage team members and assign roles.', color: 'text-blue-500' },
          { title: 'Task Tracking', icon: LayoutIcon, desc: 'Master the task board and analytics chart.', color: 'text-emerald-500' }
        ].map((box, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-6 bg-[#09090b] border border-white/5 rounded-2xl group cursor-pointer hover:border-white/10 transition-all"
          >
            <div className={`p-3 bg-white/5 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform ${box.color}`}>
              <box.icon size={24} />
            </div>
            <h3 className="text-white font-bold mb-2">{box.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{box.desc}</p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              Read Guide <ArrowRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <BookOpen className="text-slate-500" /> Frequently Asked Questions
          </h2>
          <FAQItem 
            question="How do I assign a task to a team member?" 
            answer="Only Admins can assign tasks. Click the '+ New Task' button on the dashboard, fill in the details, and select a member from the dropdown list."
          />
          <FAQItem 
            question="Can I change my role from User to Admin?" 
            answer="Roles are managed exclusively by existing Admins in the Team page. You must contact your system administrator to request a role change."
          />
          <FAQItem 
            question="Will I receive email reminders for deadlines?" 
            answer="Yes! If the system administrator has configured the email service, you will receive notifications for new assignments and upcoming deadlines."
          />
        </div>

        <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-600/20 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">Our support team is available 24/7 to help you with any technical issues or feature requests. We usually respond within 2 hours.</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Live Chat</p>
                  <p className="text-xs text-slate-500">Average response: 5 mins</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                <div className="p-2 bg-slate-700 rounded-lg text-white">
                  <Shield className="text-emerald-400" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Knowledge Base</p>
                  <p className="text-xs text-slate-500">Over 200+ articles</p>
                </div>
              </div>
            </div>
          </div>
          
          <button className="mt-8 w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-slate-200 transition-colors shadow-xl">
            Contact Support
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
