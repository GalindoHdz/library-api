// Export of existing enums
export const Enums = () => {
  return `
      ${EnumSubjects}
    `;
};

// Enum for book topics
const EnumSubjects = `
	enum EnumSubjects{
		Arts
		Fantasy
		Biographies
		Science
		Recipes
		Romance
		Religion
		Mystery_and_Detective_Stories
		Music
		Medicine
		Plays
		History
		Children
		Science_Fiction
		Textbook
	}
`;
