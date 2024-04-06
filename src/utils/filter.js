const filter = {
  everything: (points) => points,
  future: (points) => points.filter((point) => point.dateFrom > new Date()),
  present: (points) => points.filter((point) => point.dateFrom <= new Date() && point.dateTo >= new Date()),
  past: (points) => points.filter((point) => point.dateTo < new Date())
};

export { filter };
