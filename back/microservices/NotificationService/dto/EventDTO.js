export class EventDTO {
  constructor({ _id, startDate, endDate }) {
    this.id = _id;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }
}