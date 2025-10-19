// utils/generateSeats.js
function generateSeats() {
    const seats = [];
    const rows = 15;
    const cols = 6;
    const letters = ["A", "B", "C", "D", "E", "F"];
  
    for (let r = 1; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        seats.push({
          seat_no: `${r}${letters[c]}`,
          is_booked: false,
        });
      }
    }
    return seats;
  }
  
  module.exports = generateSeats;
  