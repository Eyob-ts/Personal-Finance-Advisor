import { LoginForm } from "../features/components/LoginForm"
import {motion} from "framer-motion";


export const LoginPage = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#01332B] to-[#001A15] overflow-x-auto overflow-y-auto">
        <div className="relative flex min-h-screen w-full items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <LoginForm/>
            </motion.div>
        </div>

    </div>

  );
};