export const sanitizeMoney = (s: string) => {
  const n = parseInt((s || "0").replace(/[^\d]/g, "") || "0", 10);
  return isNaN(n) ? 0 : n;
};

export const formatSalary = (salary: string) => {
  const n = sanitizeMoney(salary);
  return new Intl.NumberFormat("id-ID").format(n);
};
