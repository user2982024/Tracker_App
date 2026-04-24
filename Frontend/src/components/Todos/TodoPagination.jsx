// import { ChevronLeft, ChevronRight } from "lucide-react";

// const TodosPagination = () => {

//   return (
//     <div className="flex items-center justify-center gap-2 mt-6">
//       {/* Previous Button */}
//       <button 
//         className={`px-3 py-1 rounded-md border text-sm hover:cursor-pointer ${
//           currentPage === 1
//             ? "opacity-50 cursor-not-allowed"
//             : "hover:bg-gray-100"
//         }`}
//       >
//         Prev
//       </button>

//       {/* Page Numbers */}
//       {pages.map((page) => (
//         <button
//           key={page}
//           className={`px-3 py-1 rounded-md border text-sm hover:cursor-pointer ${
//             currentPage === page
//               ? "bg-blue-600 text-white"
//               : "hover:bg-blue-100"
//           }`}
//         >
//           {page}
//         </button>
//       ))}

//       {/* Next button */}
//       <button
//         className={`px-3 py-1 rounded-md border text-sm hover:cursor-pointer ${
//           currentPage === totalPages
//             ? "opacity-50 cursor-not-allowed"
//             : "hover:bg-blue-100"
//         }`}
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default TodosPagination;
