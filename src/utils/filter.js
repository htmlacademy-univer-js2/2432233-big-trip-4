import dayjs from 'dayjs';

const filter = {
  everything: (points) => points,
  future: (points) => points.filter((point) => dayjs().isBefore(point.dateFrom)),
  present: (points) => points.filter((point) => (dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo))),
  past: (points) => points.filter((point) => dayjs().isAfter(point.dateTo))
};

export { filter };
