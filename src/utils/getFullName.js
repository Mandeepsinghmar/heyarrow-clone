export default (person) => `${person?.firstName ? person?.firstName : ''} ${person?.lastName ? person.lastName : ''}`;
