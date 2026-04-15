import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';

interface ProfileSetupViewProps {
  saveUserProfile: (profile: { grade: string; classNum: string; attendanceNum: string; userName: string }) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ProfileSetupView: React.FC<ProfileSetupViewProps> = ({ saveUserProfile, showToast }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-theme-card w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-theme-border space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-theme-accent/10 text-theme-accent rounded-3xl flex items-center justify-center mx-auto mb-2">
            <UserCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold">ユーザー登録</h2>
          <p className="text-theme-text-muted text-xs">情報を入力して冒険を始めましょう。</p>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const grade = formData.get('grade') as string;
            const classNum = formData.get('classNum') as string;
            const attendanceNum = formData.get('attendanceNum') as string;
            const userNameInput = (formData.get('username') as string).trim();
            
            if (!grade || !classNum || !attendanceNum || !userNameInput) {
              showToast("すべての項目を入力してください。", "error");
              return;
            }
            if (parseInt(classNum) < 1 || parseInt(attendanceNum) < 1) {
              showToast("クラスと出席番号は1以上の数値を入力してください。", "error");
              return;
            }
            if (userNameInput.length > 12) {
              showToast("名前は12文字以内で入力してください。", "error");
              return;
            }
            if (/[<>/\\;]/.test(userNameInput)) {
              showToast("名前に使用できない文字が含まれています。", "error");
              return;
            }
            saveUserProfile({ grade, classNum, attendanceNum, userName: userNameInput });
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-theme-text-muted ml-2 uppercase tracking-wider">学年</label>
              <select name="grade" className="w-full px-4 py-3 bg-theme-muted border-2 border-theme-border rounded-xl focus:border-theme-accent outline-none font-bold transition-all">
                <option value="">選択</option>
                <option value="1">1年</option>
                <option value="2">2年</option>
                <option value="3">3年</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-theme-text-muted ml-2 uppercase tracking-wider">クラス</label>
              <input name="classNum" type="number" min="1" placeholder="組" className="w-full px-4 py-3 bg-theme-muted border-2 border-theme-border rounded-xl focus:border-theme-accent outline-none font-bold transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-theme-text-muted ml-2 uppercase tracking-wider">出席番号</label>
              <input name="attendanceNum" type="number" min="1" placeholder="番" className="w-full px-4 py-3 bg-theme-muted border-2 border-theme-border rounded-xl focus:border-theme-accent outline-none font-bold transition-all" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-theme-text-muted ml-2 uppercase tracking-wider">ユーザーネーム（ハンドルネーム可）</label>
            <input 
              name="username"
              type="text"
              placeholder="最大12文字"
              className="w-full px-4 py-3 bg-theme-muted border-2 border-theme-border rounded-xl focus:border-theme-accent outline-none font-bold transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-theme-accent text-white rounded-2xl font-bold text-lg shadow-lg shadow-theme-accent/30 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
          >
            冒険を始める
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};
