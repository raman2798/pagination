/** @type {import('sequelize-cli').Migration} */

const generateBooks = (num) => {
  const books = [];

  for (let i = 1; i <= num; i += 1) {
    const year = 2000 + i;
    const month = String((i % 12) + 1).padStart(2, '0'); // Ensure month is 2 digits
    const day = String((i % 28) + 1).padStart(2, '0'); // Ensure day is 2 digits

    books.push({
      title: `Book Title ${i}`,
      published: `${year}-${month}-${day}`,
      average_rating: (Math.random() * 2 + 3).toFixed(2),
    });
  }

  return books;
};

module.exports = {
  up: async (queryInterface) => {
    const books = generateBooks(100);

    await queryInterface.bulkInsert('books', books, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('books', null, {});
  },
};
