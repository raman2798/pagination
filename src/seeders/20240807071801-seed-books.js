/** @type {import('sequelize-cli').Migration} */

const generateBooks = (num) => {
  const books = [];

  const startYear = 2000;

  const endYear = 2024;

  for (let i = 1; i <= num; i += 1) {
    const year = startYear + (Math.floor((i - 1) / 12) % (endYear - startYear + 1));

    const month = String((i % 12) + 1).padStart(2, '0');

    const day = String((i % 28) + 1).padStart(2, '0');

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
    const books = generateBooks(1000000);

    await queryInterface.bulkInsert('books', books, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('books', null, {});
  },
};
