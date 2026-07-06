// Shared Utilities for EmpowerRural

// 1. Indian States and Districts Data Map
export const STATES_AND_DISTRICTS: { [key: string]: string[] } = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Nalanda", "Saran", "Purnia", "Rohtas"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Mehsana"],
  "Karnataka": ["Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Belagavi", "Dharwad", "Kalaburagi", "Mangaluru", "Tumakuru", "Shivamogga"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur", "Palakkad", "Kottayam", "Alappuzha"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna", "Ratlam"],
  "Maharashtra": ["Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Alwar", "Sikar", "Bhiliwara"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Thoothukudi", "Erode"],
  "Telangana": ["Hyderabad", "Medchal-Malkajgiri", "Ranga Reddy", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Mahabubnagar", "Nalgonda"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Ghaziabad", "Gorakhpur"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Medinipur", "Hooghly", "Asansol", "Siliguri", "Murshidabad"]
};

export const STATES_LIST = Object.keys(STATES_AND_DISTRICTS);

// 2. Formatting Utilities
export function formatSalary(salary: string | number): string {
  if (typeof salary === "number") {
    if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)} Lakh / Year`;
    }
    return `₹${salary.toLocaleString("en-IN")} / Month`;
  }
  return salary;
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// 3. Debounce Implementation
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// 4. Input Validations
export const VALIDATORS = {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  isValidMobile(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  },
  isValidPincode(pincode: string): boolean {
    const pinRegex = /^\d{6}$/;
    return pinRegex.test(pincode);
  }
};

// 5. Paginate helper
export function paginate<T>(items: T[], page: number = 1, pageSize: number = 10): {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
} {
  const offset = (page - 1) * pageSize;
  const paginatedItems = items.slice(offset, offset + pageSize);
  return {
    data: paginatedItems,
    total: items.length,
    totalPages: Math.ceil(items.length / pageSize),
    currentPage: page
  };
}

// 6. Qualifications Constants
export const QUALIFICATIONS = [
  "10th Pass",
  "12th Pass",
  "ITI Certificate",
  "Diploma (Polytechnic)",
  "Graduate (B.A. / B.Sc. / B.Com.)",
  "Graduate (B.E. / B.Tech.)",
  "Post Graduate (M.A. / M.Sc. / M.B.A.)"
];
