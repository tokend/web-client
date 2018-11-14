export const saleSortTypes = Object.freeze({
  endTime: {
    str: 'Ending soonest',
    order: 'asc',
    num: 2
  },
  popularity: {
    str: 'Popularity',
    order: 'asc',
    num: 3
  },
  created: {
    str: 'Launch date',
    order: 'desc',
    num: ''
  }
})

export const saleStates = Object.freeze({
  actual: {
    openOnly: true,
    upcoming: false,
    str: 'Live'
  },
  upcoming: {
    openOnly: true,
    upcoming: true,
    str: 'Upcoming only'
  },
  all: {
    openOnly: false,
    upcoming: false,
    str: 'All'
  }
})
