module.exports = {
  name: 'Yonas',
  process: {
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
  },
  root:
    process.env.NODE_ENV === 'production'
      ? 'https://cityofnewyork.github.io/mhfa'
      : '',
  services: [
    {
      subtitle: 'NYC Well',
      title: 'Support during a crisis',
      programProvider: 'ThriveNYC',
      body:
        'In New York City, support is always available especially in the most difficult of moments. Talk to an NYC Well counselor; it’s free, confidential, and available 24/7.',
      CTA: [
        {
          title: 'Talk to a counselor or request a mobile crisis team',
          action:
            '1-888-NYC-WELL (1-888-692-9355), Available 24 hours a day, 7 days a week',
        },
        {
          title: 'Text a counselor',
          action: "Text 'WELL' to 65173",
        },
        {
          title: 'Chat with a counselor online',
          action: 'Go to nyc.gov/nycwell',
        },
      ],
      link: '/programs/crisis-support',
      featured: true,
      category: ['Crisis Support'],
    },
    {
      subtitle: 'NYC Well',
      title: 'Support after you’ve lost a loved one.',
      programProvider: 'ThriveNYC',
      body:
        "If you've lost someone you care about, you don't have to grieve alone. Talking about it can help, and affordable support is available.",
      CTA: [
        {
          title: 'Talk to a counselor or request a mobile crisis team',
          action:
            '1-888-NYC-WELL (1-888-692-9355), Available 24 hours a day, 7 days a week',
        },
        {
          title: 'Text a counselor',
          action: "Text 'WELL' to 65173",
        },
        {
          title: 'Chat with a counselor online',
          action: 'Go to nyc.gov/nycwell',
        },
      ],
      link: '/programs/crisis-support',
      featured: false,
      category: ['Grief Support'],
    },
    {
      subtitle: 'Senior Mental Health',
      title: 'Mental health support for older adults',
      programProvider: 'NYC Department of the Aging',
      body:
        'If you’re an older adult feeling isolated or lonely, experiencing depression or anxiety, or just looking to talk to someone, you can get support – including group and individual counseling – through your neighborhood older adult center.',
      CTA: [
        {
          title: 'Talk to a counselor or request a mobile crisis team',
          action:
            '1-888-NYC-WELL (1-888-692-9355), Available 24 hours a day, 7 days a week',
        },
        {
          title: 'Text a counselor',
          action: "Text 'WELL' to 65173",
        },
        {
          title: 'Chat with a counselor online',
          action: 'Go to nyc.gov/nycwell',
        },
      ],
      link: '/programs/crisis-support',
      featured: true,
      category: ['Aging New Yorkers'],
    },
    {
      subtitle: 'NYC Well - Grief Support',
      title: 'Talk to someone after the death of a loved one',
      programProvider: 'NYC Thrive',
      body:
        'If you’ve lost someone you care about, you don’t have to grieve alone. Talking about it can help, and affordable support is available.',
      CTA: [
        {
          title: 'Talk to a counselor or request a mobile crisis team',
          action:
            '1-888-NYC-WELL (1-888-692-9355), Available 24 hours a day, 7 days a week',
        },
        {
          title: 'Text a counselor',
          action: "Text 'WELL' to 65173",
        },
        {
          title: 'Chat with a counselor online',
          action: 'Go to nyc.gov/nycwell',
        },
      ],
      link: '/programs/crisis-support',
      featured: false,
      category: ['Grief Support'],
    },
    {
      subtitle: 'NYC Well',
      title: 'Help for when you’re experiencing anxiety',
      programProvider: 'ThriveNYC',
      body:
        "If you are experiencing anxiety - feelings of fear, tension or worry - you're not alone. Talking through these feelings, learning ways to cope, and receiving support can help.Reach out to NYC Well to learn more about getting the support you need.",
      CTA: [
        {
          title: 'Talk to a counselor or request a mobile crisis team',
          action:
            '1-888-NYC-WELL (1-888-692-9355), Available 24 hours a day, 7 days a week',
        },
        {
          title: 'Text a counselor',
          action: "Text 'WELL' to 65173",
        },
        {
          title: 'Chat with a counselor online',
          action: 'Go to nyc.gov/nycwell',
        },
      ],
      link: '/programs/crisis-support',
      featured: true,
      category: ['Help With Anxiety'],
    },
  ],
  programs: [
    'Trauma Support',
    'Veterans',
    'Children and Families',
    'LGBTQ New Yorkers',
    'Care for Serious Mental Illness',
    'Crisis Support',
    'Aging New Yorkers',
    'Grief Support',
    'Help with Anxiety',
    'Substance Use Services',
  ],

  /**
   * Functions
   */
  getSelectedCheckboxValues: (name, services) => {
    // const checkboxes = document.querySelectorAll(
    //   `input[name="${name}"]:checked`
    // );
    let values = ['Trauma Support', 'Veterans', 'Help With Anxiety'];
    // checkboxes.forEach((checkbox) => {
    //   values.push(checkbox.value);
    // });

    const filteredServices = services.filter((service) =>
      values.includes(service.taxonomy)
    );
    return filteredServices;
  },
};
