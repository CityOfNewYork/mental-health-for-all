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
      title: 'Mobile crisis teams',
      subtitle: 'Request help to your home during a psychological crisis',
      programProvider: 'ThriveNYC',
      sections: [
        'What it is',
        'Who it’s for',
        'Cost',
        'How to get in touch',
        'Other ways to get help',
      ],
      body: {
        whatItIs: {
          title: 'What it is',
          content: `
            <p>
            A mobile crisis team is a group of health professionals, such as nurses, social workers, and psychiatrists, who can provide mental health services, primarily in people's homes.
            </p>
            <p>
            Depending on what a person is willing to accept, the teams may offer a range of services, including:
            </p>
            <div class="list-unordered--check">
            <ul>
            <li>Assessment</li>
            <li>Crisis intervention</li>
            <li>Supportive counseling</li>
            <li>Information and referrals, including to community-based mental health services</li>
            </ul>
            </div>
            <p></p>
            <p>
            If a mobile crisis team determines that a person in crisis needs further psychiatric or medical assessment, they can transport that person to a hospital psychiatric emergency room.
            </p>
          `,
        },
        whoItIsFor: {
          title: 'Who it’s for',
          content: `
            <p>You can request a team for yourself or someone you know. Teams serve adults and children.</p>
          `,
        },
        cost: {
          title: 'Cost',
          content: `
            <p>You do not need insurance to get services from a Mobile Crisis Team service.</p>
            <p>If you do have insurance, it will be billed.</p>
          `,
        },
        howToGetInTouch: {
          title: 'How to get in touch',
          content: [
            `
              <h3>
              Call NYC Well at <a href="tel:888-692-9355">(888) NYC-WELL (888-692-9355)</a> and ask about “mobile crisis teams”
              </h3>
              <div class="list-unordered--check">
                <ul>
                  <li>
                    Available 8:00am to 8:00pm seven days a week.
                  </li>
                  <li>
                    Available in the Bronx, Brooklyn, Manhattan, and Queens.
                  </li>
                </ul>
              </div>
            `,
          ],
        },
        otherWaysToGetHelp: {
          title: 'Other ways to get help',
          content: `
            <p>
              Visit <a href="https://nycwell.cityofnewyork.us/en/crisis-services/know-who-to-call/">NYC Well</a> to learn more about who else to call during a crisis.
            </p>
            <p>
            Learn more about  <a href="https://www1.nyc.gov/site/doh/health/health-topics/crisis-emergency-services-mobile-crisis-teams.page">Mobile Crisis Teams.</a>.
            </p>
          `,
        },
      },
      link: './programs/support-during-a-crisis',
      featured: true,
      category: {
        id: 3,
        name: 'Crisis Support',
      },
      population: {
        id: 1,
        name: 'Veterans',
      },
    },
    {
      title: 'NYC Well',
      subtitle: 'Free short-term counseling',
      programProvider: 'ThriveNYC',
      sections: [
        'What it is',
        'Who it’s for',
        'Cost',
        'How to get in touch',
        'Other ways to get help',
      ],
      body: {
        whatItIs: {
          title: 'What it is',
          content: `
            <p>
            In New York City, support is always available. A trained counselor or peer support specialist at NYC Well can listen to your concerns.
            </p>
            <p>
            Counselors can give you immediate support for problems like:
            </p>
            <div class="list-unordered--check">
            <ul>
            <li>
            Stress, depression, anxiety, drug and alcohol use<
            /li>
            <li>
            Crisis counseling and suicide prevention counseling<
            /li>
            <li>
            Support from Peer Specialists, who have personal experience with mental health or substance use challenges
            </li>
            </ul>
            </div>
          `,
        },
        whoItIsFor: {
          title: 'Who it’s for',
          content: `
            <p>Anyone can talk to an NYC Well counselor.</p>
          `,
        },
        cost: {
          title: 'Cost',
          content: `
            <p>Free</p>
          `,
        },
        howToGetInTouch: {
          title: 'How to get in touch',
          content: [
            `
              <h3>
              Talk to a counselor
              </h3>
              <div class="list-unordered--check">
                <ul>
                  <li>
                    <a href="tel:888-692-9355">(888) NYC-WELL (888-692-9355)</a>
                  </li>
                  <li>
                  It’s free, confidential, and available 24 hours a day, 7 days a week.
                  </li>
                </ul>
              </div>
            `,
            `
              <h3>
              Text a counselor
              </h3>
              <div class="list-unordered--check">
                <ul>
                  <li>
                  Text 'WELL' to 65173
                  </li>
                </ul>
              </div>
            `,
            `
              <h3>
              Chat with a counselor online
              </h3>
              <div class="list-unordered--check">
                <ul>
                  <li>
                  Go to <a href="https://nycwell.cityofnewyork.us/en/">NYC Well</a>
                  </li>
                </ul>
              </div>
            `,
          ],
        },
        otherWaysToGetHelp: {
          title: 'Other ways to get help',
          content: `
            <p>
             <a href="https://nycwell.cityofnewyork.us/en/faq/">Learn more about NYC Well</a>
            </p>
          `,
        },
      },
      link: './programs/support-during-a-crisis',
      featured: true,
      category: {
        id: 3,
        name: 'Crisis Support',
      },
      population: {
        id: 6,
        name: 'Everyone',
      },
    },
    {
      title: 'The Crime Victim Assistance Program (CVAP)',
      subtitle:
        'Mental health support for victims of domestic violence and other crimes',
      programProvider: 'NYPD & Safe Horizon',
      sections: [
        'What it is',
        'Who it’s for',
        'Cost',
        'How to get in touch',
        'Other ways to get help',
      ],
      body: {
        whatItIs: {
          title: 'What it is',
          content: `
            <p>
            CVAP victim advocates can help you get mental health assistance, navigate the legal system, and find ways to feel safe again.
            </p>
            <p>
            Victim advocates:
            </p>
            <div class="list-unordered--check">
            <ul>
            <li>
            Talk with you about your safety concerns, rights, and options<
            /li>
            <li>
            Connect you to mental health support and other resources<
            /li>
            <li>
            Advocate on your behalf for practical needs like housing and benefits
            </li>
            </ul>
            </div>
          `,
        },
        whoItIsFor: {
          title: 'Who it’s for',
          content: `
            <p>Talk to a CVAP victim advocate if you've been harmed by crime, violence, or abuse.</p>
          `,
        },
        cost: {
          title: 'Cost',
          content: `
            <p>Free</p>
          `,
        },
        howToGetInTouch: {
          title: 'How to get in touch',
          content: [
            `
              <h3>
              Contact a victim advocate near you
              </h3>
              <div class="list-unordered--check">
                <ul>
                  <li>
                  Advocates can assist you in any language. <a href="https://www1.nyc.gov/site/nypd/services/victim-services/cvap.page">Link</a>
                  </li>
                </ul>
              </div>
            `,
            `
              <h3>
              Live Chat with an advocate
              </h3>
              <div class="list-unordered--check">
                <ul>
                  <li>
                  <a href="https://www.safehorizon.org/safechat/">Link here</a>
                  </li>
                </ul>
              </div>
            `,
            `
              <h3>
              Chat with a counselor online
              </h3>
              <div class="list-unordered--check">
                <ul>
                  <li>
                  Call <a href="tel:800-621-4673">800-621-4673</a> (For help with domestic violence)
                  </li>
                </ul>
              </div>
            `,
          ],
        },
        otherWaysToGetHelp: {
          title: 'Other ways to get help',
          content: `
            <p>
            Call <a href="tel:800-689-4357">800-621-4673</a> (For help with all crimes, including support for family members of homicide victims)
            </p>
            <p>
            <a href="https://www.safehorizon.org/get-help/domestic-violence/#overview/">Learn more</a>
            </p>
          `,
        },
      },
      link: './programs/the-crime-victim-assistance-program-cvap',
      featured: true,
      category: {
        id: 3,
        name: 'Trauma Support',
      },
      population: {
        id: 6,
        name: 'Everyone',
      },
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
  population: [
    {
      id: 1,
      name: 'Veterans',
      slug: 'veterans',
    },
    {
      id: 2,
      name: 'Children and Youth',
      slug: 'children-and-youth',
    },
    {
      id: 3,
      name: 'LGBTQ',
      slug: 'lgbtq',
    },
    {
      id: 4,
      name: 'Seniors',
      slug: 'seniors',
    },
    {
      id: 5,
      name: 'Immigrants',
      slug: 'immigrants',
    },
    {
      id: 6,
      name: 'Everyone',
      slug: 'everyone',
    },
    {
      id: 7,
      name: 'Adults',
      slug: 'adults',
    },
    {
      id: 8,
      name: 'Families',
      slug: 'families',
    },
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
  createSlug: (s) =>
    s
      .toLowerCase()
      .replace(/[^0-9a-zA-Z - _]+/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-'),
};
