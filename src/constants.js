export const COLORS = [
  '#93BDF5',
  '#97DEFC',
  '#81D8D4',
  '#F995DE',
  '#F392AA',
  '#FBB397',
  '#FAD896',
  '#77C678',
  '#B697FB'
];

export const CATEGORY = [
  {
    label: 'Machine',
    value: 'machine',
  },
  {
    label: 'Category',
    value: 'category',
  },
  {
    label: 'Price',
    value: 'price',
  },
  {
    label: 'Year',
    value: 'year',
  },
  {
    label: 'Make',
    value: 'make',
  },
  {
    label: 'Model',
    value: 'model',
  },
  {
    label: 'Type',
    value: 'type',
  },
  {
    label: 'Status',
    value: 'status'
  }

];

export const DURATION_TYPES = [
  {
    label: 'Monthly',
    value: 'monthly',
  },
  {
    label: 'Quarterly',
    value: 'quarterly',
  },
  {
    label: 'Yearly',
    value: 'yearly',
  },
];

export const DURATIONTYPE = [
  {
    label: 'Month',
    value: 'monthly',
  },
  {
    label: 'Quarter',
    value: 'quarterly',
  },
  {
    label: 'Year',
    value: 'yearly',
  },
];

export const MONTHS = [
  {
    label: 'January',
    value: '1',
  },
  {
    label: 'February',
    value: '2',
  },
  {
    label: 'March',
    value: '3',
  },
  {
    label: 'April',
    value: '4',
  },
  {
    label: 'May',
    value: '5',
  },
  {
    label: 'June',
    value: '6',
  },
  {
    label: 'July',
    value: '7',
  },
  {
    label: 'August',
    value: '8',
  },
  {
    label: 'September',
    value: '9',
  },
  {
    label: 'October',
    value: '10',
  },
  {
    label: 'November',
    value: '11',
  },
  {
    label: 'December',
    value: '12',
  },
];

export const STATUSES = [
  {
    label: 'Shared',
    value: 'shared',
  },
  {
    label: 'Quoted',
    value: 'quoted',
  },
  {
    label: 'Sold',
    value: 'sold',
  },
  {
    label: 'Closed',
    value: 'closed',
  },
];

export const DEAL_MODE_STATUSES = [
  {
    label: 'In Progress',
    value: 'in_progress',
  },
  {
    label: 'Closed',
    value: 'closed',
  },
  {
    label: 'Cancelled',
    value: 'canceled',
  },
];

export const PINNEDCAMPAIGNS = [];
export const FILTERS = [];
export const FOLDERS = [];
export const TYPES = [
  {
    label: 'All Types',
    value: 'all',
  },
  {
    label: 'New',
    value: 'new',
  },
  {
    label: 'Used',
    value: 'used',
  },
];

export const QUARTERS = [
  {
    label: 'Q1',
    value: '1',
  },
  {
    label: 'Q2',
    value: '2',
  },
  {
    label: 'Q3',
    value: '3',
  },
  {
    label: 'Q4',
    value: '4',
  },
];

export const YEARS = [{
  label: 'All Years',
  value: 'all'
}];
const currentYear = new Date();
for (let i = currentYear.getFullYear(); i > 1900; i--) {
  YEARS.push({
    label: `${i}`,
    value: `${i}`
  });
}

export const DURATION_OPTIONS = [
  {
    data: MONTHS,
    placeholder: '-Month-',
    defaultValue: 1,
  },
  {
    data: QUARTERS,
    placeholder: '-Quarter- ',
    defaultValue: 1,
  },
  {
    data: YEARS,
    placeholder: '-Year-',
    defaultValue: 2020
  }
];

export const SHARE_OPTIONS = [
  {
    label: 'Share via Email',
    value: 'email'
  },
  {
    label: 'Share via Message',
    value: 'text',
  },
  {
    label: 'Share on Social',
    value: 'social'
  }
];

export const ANALYTICS_TYPES = [
  {
    label: '6 Months',
    value: '6 months'
  },
  {
    label: '12 Months',
    value: '12 months'
  },
  {
    label: '3 Months',
    value: '3 months'
  },
  {
    label: '30 Days',
    value: '30 days'
  },
  {
    label: '10 Days',
    value: '10 days'
  },

];

export const RESPONSETYPE = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Unread',
    value: 'unread'
  },
  {
    label: 'Unassigned',
    value: 'unassigned'
  },
  {
    label: 'Disqualifed',
    value: 'disqualified'
  }
];

export const CONVERSION = [
  {
    label: 'Overview',
    value: 'overview'
  },
  {
    label: 'Conversion',
    value: 'conversion'
  },
  {
    label: 'All',
    value: 'all'
  }
];

export const LISTTYPE = [
  {
    label: '7 Days',
    value: '7 days'
  },
  {
    label: '14 Days',
    value: '14 days'
  },
  {
    label: '30 Days',
    value: '30 days'
  }

];

export const ServiceList = [
  {
    label: '15 Days',
    value: '15 days'
  },
  {
    label: '30 Days',
    value: '30 days'
  },
  {
    label: '3 Months',
    value: '3 Months'
  },
  {
    label: '6 Months',
    value: '6 Months'
  }
];

export const GOOGLE_STORAGE = 'https://storage.googleapis.com/hey-arrow-dev/';
export const API_URL = 'https://us-central1-arrow-289608.cloudfunctions.net/v2';
export const DEV_DOMAIN = 'aerialtitans';
export const DOMAIN = process.env.NODE_ENV === 'production' ? window.location.hostname.split('.')[0].split('-v2')[0] : DEV_DOMAIN;
export const EXTERNAL_PRODUCT_URL = 'https://arrow-289608.web.app/products';

export const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJpYXQiOjE2MTUzNzkxMTcsImV4cCI6MTY0NjkxNTExN30.Pg4MSVzoXS83VDKrIR7iY4v3rnMe5yz8bxQ9XXQAMBk';
export const API_MARKETING = 'https://us-central1-arrow-bravo-team-dev-env.cloudfunctions.net/apis';
