import { Info } from 'lucide-react';

export default function SetupInstructions() {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full p-8">
        <div className="flex items-start gap-4 mb-6">
          <Info className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">تنظیمات اولیه</h2>
            <p className="text-slate-300">
              برای استفاده از این برنامه، نیاز به یک کلید API رایگان از TMDB دارید.
            </p>
          </div>
        </div>

        <div className="space-y-6 text-slate-300 leading-relaxed">
          <div>
            <h3 className="text-white font-semibold mb-2">مراحل دریافت API Key:</h3>
            <ol className="list-decimal list-inside space-y-3 mr-4">
              <li>
                به وبسایت{' '}
                <a
                  href="https://www.themoviedb.org/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  themoviedb.org
                </a>{' '}
                بروید و ثبت‌نام کنید (رایگان است)
              </li>
              <li>
                بعد از ورود، به بخش{' '}
                <span className="text-emerald-400 font-mono">Settings → API</span> بروید
              </li>
              <li>
                روی{' '}
                <span className="text-emerald-400 font-mono">Request an API Key</span> کلیک کنید
              </li>
              <li>
                گزینه{' '}
                <span className="text-emerald-400 font-mono">Developer</span> را انتخاب کنید
              </li>
              <li>
                فرم را پر کنید (می‌توانید هر چیزی بنویسید، مهم نیست)
              </li>
              <li>
                کلید API خود را کپی کنید
              </li>
              <li>
                فایل{' '}
                <span className="bg-slate-700 px-2 py-1 rounded font-mono text-sm">.env</span>{' '}
                را در ریشه پروژه باز کنید
              </li>
              <li>
                این خط را اضافه کنید:{' '}
                <code className="bg-slate-700 px-3 py-1 rounded font-mono text-sm block mt-2">
                  VITE_TMDB_API_KEY=YOUR_API_KEY_HERE
                </code>
              </li>
              <li>
                صفحه را رفرش کنید
              </li>
            </ol>
          </div>

          <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-lg p-4">
            <p className="text-sm">
              <strong className="text-emerald-400">نکته:</strong> این API کاملا رایگان است و نیازی به کارت بانکی ندارد.
              محدودیت روزانه آن 1000 درخواست است که برای استفاده شخصی کافی است.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
