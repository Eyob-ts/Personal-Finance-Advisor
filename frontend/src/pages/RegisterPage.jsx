// import { RegisterForm } from "../features/components/RegisterForm";


// export const RegisterPage = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <RegisterForm />
//     </div>
//   );
// };

import { motion } from "framer-motion";
import { RegisterForm } from "../features/components/RegisterForm";

export const RegisterPage = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#01332B] to-[#001A15] overflow-x-auto overflow-y-auto">
  <div className="relative flex min-h-screen w-full items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <RegisterForm />
    </motion.div>
  </div>
</div>

  );
};