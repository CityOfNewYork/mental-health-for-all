module.exports = [
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
          <p>A mobile crisis team is a group of health professionals, such as nurses, social workers, and psychiatrists, who can provide mental health services, primarily in people's homes.</p>

          <p>Depending on what a person is willing to accept, the teams may offer a range of services, including:</p>

          <div class="list-unordered--check">
            <ul>
              <li>Assessment</li>

              <li>Crisis intervention</li>

              <li>Supportive counseling</li>

              <li>Information and referrals, including to community-based mental health services</li>
            </ul>
          </div>

          <p>If a mobile crisis team determines that a person in crisis needs further psychiatric or medical assessment, they can transport that person to a hospital psychiatric emergency room.</p>
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
          {
            type: 'website',
            body: `
            <h3>Call NYC Well at <a href="tel:888-692-9355">(888) NYC-WELL (888-692-9355)</a> and ask about “mobile crisis teams”</h3>

            <div class="list-unordered--check">
              <ul>
                <li>Available 8:00am to 8:00pm seven days a week.</li>

                <li>Available in the Bronx, Brooklyn, Manhattan, and Queens.</li>
              </ul>
            </div>
          `,
          },
        ],
      },
      otherWaysToGetHelp: {
        title: 'Other ways to get help',
        content: `
          <p>Visit <a href="https://nycwell.cityofnewyork.us/en/crisis-services/know-who-to-call/">NYC Well</a> to learn more about who else to call during a crisis.</p>

          <p>Learn more about  <a href="https://www1.nyc.gov/site/doh/health/health-topics/crisis-emergency-services-mobile-crisis-teams.page">Mobile Crisis Teams.</a>.</p>
        `,
      },
    },
    link: './programs/support-during-a-crisis',
    featured: [],
    categories: [
      {
        id: 3,
        name: 'Crisis Support',
      },
      {
        id: 10,
        name: 'Serious mental illness',
      },
      {
        id: 9,
        name: 'Mental Health Care',
      },
    ],
    population: [
      {
        id: 6,
        name: 'Everyone',
      },
    ],
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
          <p>In New York City, support is always available. A trained counselor or peer support specialist at NYC Well can listen to your concerns.</p>

          <p>Counselors can give you immediate support for problems like:</p>

          <div class="list-unordered--check">
            <ul>
              <li>Stress, depression, anxiety, drug and alcohol use</li>

              <li>Crisis counseling and suicide prevention counseling</li>

              <li>Support from Peer Specialists, who have personal experience with mental health or substance use challenges</li>
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
          {
            type: 'calling',
            body: `
            <h3>Talk to a counselor</h3>

            <div class="list-unordered--check">
              <ul>
                <li><a href="tel:888-692-9355">(888) NYC-WELL (888-692-9355)</a></li>

                <li>It’s free, confidential, and available 24 hours a day, 7 days a week.</li>
              </ul>
            </div>
          `,
          },
          {
            type: 'texting',
            body: `
            <h3>Text a counselor</h3>

            <div class="list-unordered--check">
              <ul>
                <li>Text 'WELL' to 65173</li>
              </ul>
            </div>
          `,
          },
          {
            type: 'website',
            body: `
            <h3>Chat with a counselor online</h3>

            <div class="list-unordered--check">
              <ul>
                <li>Go to <a href="https://nycwell.cityofnewyork.us/en/">NYC Well</a></li>
              </ul>
            </div>
          `,
          },
        ],
      },
      otherWaysToGetHelp: {
        title: 'Other ways to get help',
        content: `
          <p><a href="https://nycwell.cityofnewyork.us/en/faq/">Learn more about NYC Well</a></p>
        `,
      },
    },
    link: './programs/support-during-a-crisis',
    featured: [
      {
        id: 6,
        name: 'Everyone',
      },
      {
        id: 8,
        name: 'Adults',
      },
    ],
    categories: [
      {
        id: 3,
        name: 'Crisis Support',
      },
      {
        id: 5,
        name: 'Help with Anxiety',
      },
      {
        id: 4,
        name: 'Grief Support',
      },
      {
        id: 6,
        name: 'Substance Use Services',
      },
      {
        id: 10,
        name: 'Serious mental illness',
      },
      {
        id: 7,
        name: 'Peer Support',
      },
      {
        id: 8,
        name: 'Counseling',
      },
    ],
    population: [
      {
        id: 6,
        name: 'Everyone',
      },
    ],
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
          <p>CVAP victim advocates can help you get mental health assistance, navigate the legal system, and find ways to feel safe again.</p>

          <p>Victim advocates:</p>

          <div class="list-unordered--check">
            <ul>
              <li>Talk with you about your safety concerns, rights, and options</li>

              <li>Connect you to mental health support and other resources</li>

              <li>Advocate on your behalf for practical needs like housing and benefits</li>
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
          {
            type: 'website',
            body: `
            <h3>Contact a victim advocate near you</h3>

            <div class="list-unordered--check">
              <ul>
                <li>Advocates can assist you in any language. <a href="https://www1.nyc.gov/site/nypd/services/victim-services/cvap.page">Link</a></li>
              </ul>
            </div>
          `,
          },
          {
            type: 'online-chat',
            body: `
            <h3>Live Chat with an advocate</h3>

            <div class="list-unordered--check">
              <ul>
                <li><a href="https://www.safehorizon.org/safechat/">Link here</a></li>
              </ul>
            </div>
          `,
          },
          {
            type: 'calling',
            body: `
            <h3>Chat with a counselor online</h3>

            <div class="list-unordered--check">
              <ul>
                <li>Call <a href="tel:800-621-4673">800-621-4673</a> (For help with domestic violence)</li>
              </ul>
            </div>
          `,
          },
        ],
      },
      otherWaysToGetHelp: {
        title: 'Other ways to get help',
        content: `
          <p>Call <a href="tel:800-689-4357">800-621-4673</a> (For help with all crimes, including support for family members of homicide victims)</p>

          <p><a href="https://www.safehorizon.org/get-help/domestic-violence/#overview/">Learn more</a></p>
        `,
      },
    },
    link: './programs/the-crime-victim-assistance-program-cvap',
    featured: [],
    categories: [
      {
        id: 1,
        name: 'Trauma Support',
      },
    ],
    population: [
      {
        id: 6,
        name: 'Everyone',
      },
    ],
  },
  {
    title: 'Mission: VetCheck',
    subtitle:
      'Mission: VetCheck connects veterans to trained volunteers through one-on-one supportive check-in calls.',
    programProvider:
      'NYC Department of Veterans’ Services & The Mayor’s Office of Community Mental Health and Unite Us',
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
          <p>As a veteran, you can request a supportive check-in call from a trained volunteer through Mission: VetCheck. Check-ins give you one-on-one support and help you get information on accessing vital public services like:</p>


          <div class="list-unordered--check">
          <ul>
          <li>free meals</li>

          <li>COVID-19 testing locations</li>

          <li>mental health resources</li>
          </ul>
          </div>

          <p>VetCheck check-ins are not a substitute for immediate or life-threatening concerns.</p>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>Mission: VetCheck is available to veterans across New York City during the COVID-19 crisis.</p>
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
          {
            type: 'website',
            body: `
            <h3>CRequest a Check-in by <a href="https://thrivenyc.cityofnewyork.us/mission-vetcheck">filling out this form</a> . Check-ins happen 9 am – 7 pm, 7 days a week.</h3>
          `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [
      {
        id: 1,
        name: 'Veterans',
      },
    ],
    categories: [
      {
        id: 1,
        name: 'Trauma Support',
      },
      {
        id: 5,
        name: 'Help with Anxiety',
      },
    ],
    population: [
      {
        id: 1,
        name: 'Veterans',
      },
    ],
  },
  {
    title: 'Family Justice Centers',
    subtitle:
      'Legal and social services for survivors of domestic and gender-based violence',
    programProvider: "Mayor's Office to End Domestic and Gender-Based Violence",
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
          <p>If you’re a survivor of domestic and gender-based violence, a Family Justice Center (FJC) can help. This includes sexual violence, human trafficking, stalking, intimate partner violence, and more.</p>

          <p>Family Justice Centers offer legal and social service support for survivors and their families, as well as mental health support including:</p>

          <div class="list-unordered--check">
            <ul>
              <li>Crisis counseling and connections to ongoing support</li>

              <li>Legal help for orders of protection, custody, visitation, child support, divorce, housing, and immigration</li>

              <li>Individual and group therapy</li>

              <li>Safety planning</li>
            </ul>
          </div>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>All are welcome regardless of language, income, gender identity, or immigration status.</p>
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
          {
            type: 'website',
            body: `
            <h3><a href="https://www1.nyc.gov/site/nypd/services/victim-services/cvap.page">Visit a Family Justice Center</a></li></h3>

            <div class="list-unordered--check">
              <ul>
                <li>There’s a Family Justice Center in every borough.</li>
                <li>Monday through Friday</li>
                <li>9 a.m. to 5 p.m.</li>
                <li>No appointment is needed.</li>
              </ul>
            </div>
          `,
          },
          {
            type: 'calling',
            body: `
            <h3>Call <a href="tel:311">311</a></h3>

            <div class="list-unordered--check">
              <ul>
                <li>Ask about “Family Justice Centers”</li>
              </ul>
            </div>
          `,
          },
          {
            type: 'calling',
            body: `
            <h3>Call the City's 24-hour Domestic Violence Hotline at <a href="tel:800-621-HOPE">800-621-HOPE (4673)</a> for immediate safety planning, shelter assistance, and other resources.</h3>

            <div class="list-unordered--check">
              <ul>
                <li>TTY: <a href="tel:800-810-7444">800-810-7444</a></li>
              </ul>
            </div>
          `,
          },
        ],
      },
    },
    link: './programs/family-justice-centers',
    featured: [
      {
        id: 2,
        name: 'Families',
      },
    ],
    categories: [
      {
        id: 1,
        name: 'Trauma Support',
      },
    ],
    population: [
      {
        id: 6,
        name: 'Everyone',
      },
      {
        id: 2,
        name: 'Families',
      },
      {
        id: 8,
        name: 'Adults',
      },
      {
        id: 3,
        name: 'LGBTQ New Yorkers',
      },
      {
        id: 7,
        name: 'Immigrants',
      },
    ],
  },
  {
    title: 'Geriatric Mental Health Initiative',
    subtitle:
      'New Yorkers age 60 and older can get mental health screenings, on-site counseling, and referrals at senior centers near them.',
    programProvider: 'Department for the Aging (DFTA)',
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
          <p>If you’re an older adult who needs mental health support, you can speak to a mental health clinician at a senior center near you.</p>

          <p>Mental health clinicians can screen you for depression, provide on-site counseling, and give referrals. They can also talk to you about anxiety and depression.</p>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>Adults who are age 60 or older can see a mental health clinician.</p>
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
          {
            type: 'website',
            body: `
            <h3><a href="https://www1.nyc.gov/site/dfta/services/find-help.page">Find a senior center with a mental health clinician</a></li></h3>

            <div class="list-unordered--check">
              <ul>
                <li>Search for “Geriatric Mental Health” under <strong>Services</strong>. </li>
                <li>Choose a location from the results and call them for more information.</li>
              </ul>
            </div>
          `,
          },
          {
            type: 'calling',
            body: `
            <h3>Call AGING Connect at <a href="tel:212-244-6469">212-244-6469</a> and ask about Geriatric Mental Health</h3>
          `,
          },
          {
            type: 'calling',
            body: `
            <h3>Learn more at <a href="https://www1.nyc.gov/site/dfta/services/thrivenyc-at-dfta.page"> Department for the Aging</a>.</h3>
          `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [
      {
        id: 4,
        name: 'Seniors',
      },
    ],
    categories: [
      {
        id: 5,
        name: 'Help with Anxiety',
      },
      {
        id: 10,
        name: 'Serious mental illness',
      },
      {
        id: 9,
        name: 'Mental Health Care',
      },
    ],
    population: [
      {
        id: 4,
        name: 'Seniors',
      },
    ],
  },
  {
    title: 'Friendly Visiting and Friendly VOICES',
    subtitle:
      'Older New Yorkers who feel isolated can connect with a peer to talk about shared interests.',
    programProvider: 'Department for the Aging (DFTA)',
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
          <p>If you’re an older adult feeling isolated or lonely, experiencing depression or anxiety, or just looking to talk to someone, the Friendly Programs can help. </p>

          <p><strong>Friendly Visiting</strong> is a program for homebound older adults who have ongoing health challenges that make it difficult for them to go out. </p>
          <p>You can get paired with a volunteer visitor or peer who is close to your age. A volunteer can visit you in your home to talk about shared interests and experiences. You may also join a virtual group to talk with others.</p>
          <p>Due to COVID-19, volunteers are currently maintaining social distancing guidelines and are connecting with their matches by phone and video calls.</p>
          <p><strong>Friendly VOICES</strong> is a program for older adults who are isolated for other reasons (such as COVID-19).</p>
          <p>You’ll be matched with a volunteer whom you can keep in touch by phone or video calls. You also have the option to join a virtual group or be matched with a peer close to your age.</p>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>The Friendly Programs are open to older adults.</p>
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
          {
            type: 'calling',
            body: `
            <h3>Call AGING Connect at <a href="tel:212-244-6469">212-244-6469</a> and ask about the Friendly Programs.</h3>
          `,
          },
          {
            type: 'calling',
            body: `
            <h3><a href="https://www.surveymonkey.com/r/G8VSSVS">Fill out the interest form to enroll in Friendly VOICES.</a> You’ll be contacted with next steps.</h3>
          `,
          },
        ],
      },
      otherWaysToGetHelp: {
        title: 'Other ways to get help',
        content: `
          <p>Learn more online from the Department for the Aging. <a href="https://www1.nyc.gov/site/dfta/services/friendly-programs.page">Department for the Aging</a></p>
        `,
      },
    },
    link: './programs/',
    featured: [
      {
        id: 4,
        name: 'Seniors',
      },
    ],
    categories: [
      {
        id: 7,
        name: 'Peer Support',
      },
    ],
    population: [
      {
        id: 4,
        name: 'Seniors',
      },
    ],
  },
  {
    title: 'Program for Survivors of Torture',
    subtitle:
      'Immigrants who survived torture and are applying for asylum can access medical, mental health, and other services.',
    programProvider: 'Bellevue and NYC Health + Hospitals',
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
          <p>If you are someone who was tortured or persecuted by your family or another person, help is available.</p>

          <p>The Program for Survivors of Torture (PSOT) at NYC Health + Hospitals and Bellevue assists individuals and families who survived torture and human rights abuses.</p>
          <p>You can get:</p>

          <div class="list-unordered--check">
          <ul>
            <li><strong>Medical services</strong> including labs and referrals to specialists.</li>
            <li><strong>Mental health services</strong> like group therapy, psychiatric support, and more.</li>
            <li><strong>Social services</strong> like housing support, English classes, and more.</li>
            <li><strong>Legal services</strong> to help you obtain asylum.</li>
          </ul>
        </div>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>If you’ve already applied for asylum in the United States or plan to apply for asylum, you may be eligible.</p>
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
          {
            type: 'website',
            body: `
            <h3>If you or someone you know is interested in becoming a client, complete a <a href="https://docs.google.com/forms/d/e/1FAIpQLSc2QK6MtLyn1zCkzP1XeYbMZxN7T9xDzkliJ7jAmWwPGls9Uw/viewform">referral form</a>.</h3>
          `,
          },
          {
            type: 'website',
            body: `
            <h3>Email for more information <a href="mailto: info@survivorsoftorture.org">info@survivorsoftorture.org.</a></h3>
          `,
          },
        ],
      },
      otherWaysToGetHelp: {
        title: 'Other ways to get help',
        content: `
          <p>Learn more from <a href="https://www.survivorsoftorture.org/">survivorsoftorture.org</a></p>
        `,
      },
    },
    link: './programs/',
    featured: [
      {
        "id": 7,
        "name": "Immigrants",
      },
    ],
    categories: [
      {
        id: 1,
        name: 'Trauma Support',
      },
      {
        id: 7,
        name: 'Peer Support',
      },
      {
        id: 9,
        name: 'Mental Health Care',
      },
      {
        id: 10,
        name: 'Serious mental illness',
      },
    ],
    population: [
      {
        id: 2,
        name: 'Families',
      },
      {
        id: 8,
        name: 'Adults',
      },
      {
        id: 7,
        name: 'Immigrants',
      },
    ],
  },
  {
    title: 'Clubhouses',
    subtitle:
      'People who struggle with mental illness and substance abuse can go to a Clubhouse to connect with peers and get help rejoining society.',
    programProvider: 'Department of Health and Mental Hygiene',
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
          <p>Clubhouses are supportive communities for people with a history of serious mental illness and substance misuse.</p>

          <p>You can find meaningful work and educational opportunities and social connections in these unique, member-run spaces.</p>
          <p>Designed to help people rejoin society and maintain their position in it, clubhouses offer:</p>

          <div class="list-unordered--check">
          <ul>
          <li>mutual support from other members</li>
          <li>professional staff support</li>
          <li>work training</li>
          <li>educational opportunities</li>
          <li>social connection</li>
          </ul>
          </div>
          <p>There are clubhouses in The Bronx, Brooklyn, Manhattan, and Queens.</p>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>If you’re an adult with a history of serious mental illness or substance misuse, a clubhouse can help.</p>
        `,
      },
      cost: {
        title: 'Cost',
        content: `
          <p>Clubhouses are free for people to access.</p>
        `,
      },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'calling',
            body: `
            <h3>Call <a href="tel:1-888-NYC-Well">1-888-NYC-Well </a> to find a clubhouse near you
            Ask for a Clubhouse near you.
            </h3>
          `,
          },
          {
            type: 'website',
            body: `
            <h3>Visit the <a href="https://nycwell.cityofnewyork.us/en/find-services/">NYC Well service directory</a> to find a clubhouse. Search for "Clubhouse"</h3>
          `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [
      {
        id: 8,
        name: 'Adults',
      },
    ],
    categories: [
      {
        id: 6,
        name: 'Substance Use Services',
      },
      {
        id: 10,
        name: 'Serious mental illness',
      },
      {
        id: 7,
        name: 'Peer Support',
      },
    ],
    population: [
      {
        id: 8,
        name: 'Adults',
      },
      {
        id: 4,
        name: 'Seniors',
      },
    ],
  },
  {
    title: 'NYC Care',
    subtitle:
    'Low- or no- cost healthcare for New Yorkers who can’t afford or are ineligible for health insurance',
    programProvider: 'NYC Health + Hospitals',
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
        <p>Health care is a human right. That’s why New York City guarantees health care for all New Yorkers – and that includes mental health care.</p>

        <p>NYC Care is a health access program at NYC Health + Hospitals. As a NYC Care member, you can access your primary care provider at a care site near you.</p>
        <p>You’ll also have access to a full suite of healthcare, including comprehensive mental health support at low- or no-cost.</p>
        <p>There are NYC Care locations in all 5 boroughs.</p> <a href="https://www.nyccare.nyc/locations/">Find a location near you.</a>

        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>You may be eligible for NYC Care if:</p>
          <div class="list-unordered--check">
          <ul>
          <li>you’ve lived in New York in the past 6 months</li>
          <li>You can’t afford or are ineligible for health insurance</li>
          </ul>
          </div>
          `,
        },
      cost: {
        title: 'Cost',
        content: `
        <p>NYC Care provides health care at low- or no-cost.</p>
        `,
      },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'calling',
            body: `
            <h3>Call <a href="tel:646-NYC CARE">646-NYC CARE</a> to get more information or check your eligibility.</h3>
            `,
          },
        ],
      },
      otherWaysToGetHelp: {
        title: 'Other ways to get help',
        content: `
        <p>Learn more about NYC Care by visiting<a href="https://www.nyccare.nyc/">nyccare.nyc</a></p>
        `,
      },
    },
    link: './programs/',
    featured: [
      {
        "id": 7,
        "name": "Immigrants",
      },
    ],
    categories: [
      {
        id: 10,
        name: 'Serious mental illness',
      },
      {
        id: 9,
        name: 'Mental Health Care',
      },
    ],
    population: [
      {
        id: 6,
        name: 'Everyone',
      },
    ],
  },
  {
    title: 'Drop-in Centers for Runaway and Homeless Youth',
    subtitle:
    'Emergency drop-in centers for homeless and runaway youth who need food and other essentials.',
    programProvider: 'Department of Youth and Community Development (DYCD)',
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
        <p>If you’re age 14 – 24 and need emergency shelter, you can go to a Drop-in Center. You can get essentials like:</p>

        <div class="list-unordered--check">
        <ul>
        <li>Food</li>
        <li>Food</li>
        <li>Immediate shelter</li>
        </ul>
        </div>

        <p>You can also get access to counseling, support, and referrals to relevant services.</a>

        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
        <p>Youth age 14 – 24</p>
        `,
      },
      cost: {
        title: 'Cost',
        content: `
        <p>Services at drop-in centers are provided at no cost.</p>
        `,
      },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'website',
            body: `
            <h3><a href="https://www1.nyc.gov/site/dycd/services/runaway-homeless-youth/borough-based-drop-in-centers.page">Find a drop-in center near you.</a> There are drop-in centers in every borough. Some are open 24/7; check the hours of operation before going.</h3>
            `,
          },
          {
            type: 'calling',
            body: `
            <h3>Call DYCD Youth Connect</h3>
            <p>Call in NYC: <a href="tel:800-246-4646">800-246-4646</a></p>
            <p>Outside NYC: <a href="tel:646-343-6800">646-343-6800</a></p>
            <p>Hours of operation are from Monday – Friday 9 AM – 5 PM.</p>

            `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [
      {
        id: 5,
        name: 'Children and Youth',
      },
    ],
    categories: [
      {
        id: 1,
        name: 'Trauma Support',
      },
      {
        id: 5,
        name: 'Help with Anxiety',
      },
      {
        id: 6,
        name: 'Substance Use Services',
      },
      {
        id: 8,
        name: 'Counseling',
      },
    ],
    population: [
      {
        id: 5,
        name: 'Children and Youth',
      },
    ],
  },
  {
    title: 'NYC Family Resource Centers',
    subtitle:
      'Family support services for parents of youth with mental health challenges.',
      programProvider: 'NYC Department of Health and Mental Hygiene',
      sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
      body: {
        whatItIs: {
          title: 'What it is',
        content: `
        <p>Raising a child with emotional and behavioral difficulties can be challenging.</p>
          <p>Family Resource Centers (FRCs) provide family support services
          to parents/caregivers of children and youth. If you have a child with mental health needs, you can get support like:
          </p>

          <div class="list-unordered--check">
          <ul>
          <li>Emotional support</li>
          <li>Advocacy to help navigate child-serving systems</li>
          <li>Information about mental health conditions, services, and family rights</li>
          <li>Referrals to appropriate services and resources</li>
          <li>Skill development through educational workshops</li>
          <li>Recreational activities</li>
          <li>Respite</li>
          </ul>
          </div>

          <p>Support services are individual and group-based.</p>
          `,
        },
        whoItIsFor: {
          title: 'Who it’s for',
          content: `
          <p>Parents and caregivers of children and youth from birth – age 24</p>
          `,
        },
        cost: {
          title: 'Cost',
          content: `
          <p>All FRC services are free. You don’t need a referral to access services.</p>
          `,
        },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'website',
            body: `
            <h3><a href="https://www1.nyc.gov/assets/doh/downloads/pdf/mh/fam-sup-dir.pdf">Contact a Family Resource Center</a>. They’re available in every borough.</h3>
            `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [],
    categories: [
      {
        id: 7,
        name: 'Peer Support',
      },
    ],
    population: [
      {
        id: 2,
        name: 'Families',
      },
      {
        id: 5,
        name: 'Children and Youth',
      },
    ],
  },
  {
    title: 'Early Childhood Mental Health Network',
    subtitle:
      'Parents worried about their children’s emotions or behaviors can get specialized mental health treatment for their children.',
    programProvider: 'Department of Health and Mental Hygiene',
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
          <p>If you’re a parent who is concerned about your child’s emotions, behavior, or relationships, you can get help. An early childhood therapeutic center can help you address these challenges early.</p>

          <p>Early childhood therapeutic centers offer:</p>

          <div class="list-unordered--check">
          <ul>
          <li>Specialized mental health treatment for children from birth to age five and their families.</li>
          <li>Access to family peer advocates and connection to ongoing support. </li>
          </ul>
          </div>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>Parents and young children from birth to age 5.</p>
        `,
      },
      cost: {
        title: 'Cost',
        content: `
          <p>Centers accept Medicaid and other insurance. They’ll also work with you to ensure access.</p>
        `,
      },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'website',
            body: `
            <h3><a href="https://nycwell.cityofnewyork.us/en/find-services/">Call and make an appointment at a Center near you. </a>There are Centers in every borough.
            </h3>
          `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [
      {
        id: 2,
        name: 'Families',
      },
    ],
    categories: [
      {
        id: 1,
        name: 'Trauma Support',
      },
      {
        id: 5,
        name: 'Help with Anxiety',
      },
      {
        id: 7,
        name: 'Peer Support',
      },
      {
        id: 9,
        name: 'Mental Health Care',
      },
    ],
    population: [
      {
        id: 2,
        name: 'Families',
      },
      {
        id: 5,
        name: 'Children and Youth',
      },
    ],
  },
  {
    title: 'Comprehensive Psychiatric Emergency Services Program (CPEP)',
    subtitle:
      'Psychiatric emergency services for New Yorkers at NYC Health + Hospitals',
    programProvider: 'NYC Health + Hospitals',
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
          <p>NYC Health + Hospitals offers all New Yorkers comprehensive psychiatric emergency services throughout the system’s 11 hospitals.</p>
          <p>This includes extended observation for children, adolescents, and adults who need:</p>

          <div class="list-unordered--check">
          <ul>
          <li>emergency mental health services</li>
          <li>specialized care for the evaluation and treatment of psychiatric crises, including suicidal or aggressive behavior.
          </li>
          </ul>
          </div>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>Available for all ages</p>
        `,
      },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'calling',
            body: `
            <h3><a href="tel:911f">Call 911 </a>. if there’s a medical emergency.</h3>
          `,
          },
          {
            type: 'calling',
            body: `
            <h3>Call NYC Health + Hospitals at <a href="tel:911f">844-NYC-4NYC</a>. Ask about emergency mental health services. if there’s a medical emergency.</h3>
          `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [],
    categories: [
      {
        id: 10,
        name: 'Serious mental illness',
      },
      {
        id: 9,
        name: 'Mental Health Care',
      },
    ],
    population: [
      {
        id: 6,
        name: 'Everyone',
      },
    ],
  },
  {
    title: 'Naloxone',
    subtitle:
      'Free Naloxone kits from community-based programs and pharmacies to reverse an opioid overdose.',
    programProvider: 'Department of Mental Health and Hygiene (DOHMH)',
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
          <p>Naloxone (Narcan®) is a safe medication that can save someone’s life by reversing the effects of an opioid overdose. It only works on opioids, such as heroin, prescription painkillers and fentanyl, but it is safe to use even if opioids are not present.</p>
          <p>If you are worried you or someone you know may be at risk of an opioid overdose, naloxone is available to you.</p>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>Anyone can request a Naloxone kit.</p>
        `,
      },
      cost: {
        title: 'Cost',
        content: `
          <p>You can get a free Naloxone kit at participating community-based programs and pharmacies near you. You can also attend a virtual training and get a kit by mail.</p>
        `,
      },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'website',
            body: `
            <h3><a href="https://www1.nyc.gov/assets/doh/downloads/pdf/basas/naloxone-list-of-prevention-programs.pdf">Contact a community-based program (PDF) to get a free kit</a>. There are programs in every borough.</h3>
          `,
          },
          {
            type: 'website',
            body: `
            <h3><a href="https://www1.nyc.gov/assets/doh/downloads/pdf/basas/naloxone-list-of-pharmacy.pdf">Visit a pharmacy (PDF) to get a free kit</a>. Ask the pharmacist for a free “Emergency Overdose Rescue Kit”.</h3>
          `,
          },
          {
            type: 'website',
            body: `
            <h3><a href="https://www1.nyc.gov/site/doh/health/health-topics/naloxone.page">Attend a virtual training and get a kit by mail</a>. Trainings are hosted by DOHMH.</h3>
          `,
          },
        ],
      },
      otherWaysToGetHelp: {
        title: 'Other ways to get help',
        content: `
          <h3>How to purchase naloxone with insurance or out-of-pocket:</h3>

          <div class="list-unordered--check">
          <ul>
          <li><p>Check the <a href="https://www1.nyc.gov/assets/doh/downloads/pdf/basas/naloxone-list-of-pharmacy.pdf" >list of participating pharmacies (PDF)</a></p>

          </li>
          <li><p>You can also use the <a href="https://a816-healthpsi.nyc.gov/NYCHealthMap/home/ByServices?services=2" >NYC Health Map</a> to find a pharmacy near you.</p>

          </li>
          <li><p>When contacting a pharmacy, ask the pharmacist about getting naloxone/Narcan®.</p>

          </li>
          <li><p>You do not need a prescription from your doctor.</p>

          </li>
          <li><p>The pharmacy may need to order the medication.</p>

          </li>
          <li><p>If a pharmacy is enrolled in the Naloxone Co-payment Assistance Program (N-CAP), up to $40 of your insurance copay can be covered. Ask your pharmacist about the program when requesting naloxone.</p>

          </li>
          <li><p>If you are having a hard time getting naloxone, email <a href="mailto:naloxone@health.nyc.gov" >naloxone@health.nyc.gov</a></p>

          </li>
          </li>
          </ul>
          </div>
        `,
      },
    },
    link: './programs/',
    featured: [],
    categories: [
      {
        id: 6,
        name: 'Substance Use Services',
      },
    ],
    population: [
      {
        id: 6,
        name: 'Everyone',
      },
    ],
  },
  {
    title: 'Syringe Service Programs',
    subtitle:
      'Drug use supplies and overdose prevention education for people who use drugs',
    programProvider: 'Department of Mental Health and Hygiene (DOHMH)',
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
        <p>There are 15 syringe service programs across the city that provide critical services to people who use drugs. Services include: </p>
        <div class="list-unordered--check">
        <ul>
        <li><p>sterile drug use supplies</p>

        </li>
        <li><p>overdose prevention education</p>

        </li>
        <li><p>harm reduction counseling. </p>

        </li>
        </ul>
        </div>
        <br>
        <p>Harm reduction can help prevent problems including acute and chronic infections, and overdose. </p>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>Syringe Service Programs are open to all New Yorkers.</p>
        `,
      },
      cost: {
        title: 'Cost',
        content: `
          <p>Syringe Service Programs are free</p>
        `,
      },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'website',
            body: `
            <h3><a href="https://www1.nyc.gov/assets/doh/downloads/pdf/basas/syringe-service.pdf">Visit a Syringe Service Program</a>. You’ll find them in all boroughs </h3>
          `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [
      {
        id: 6,
        name: 'Everyone',
      },
    ],
    categories: [
      {
        id: 6,
        name: 'Substance Use Services',
      },
    ],
    population: [
      {
        id: 6,
        name: 'Everyone',
      },
    ],
  },
  {
    title: 'Gotham Pride Health Centers',
    subtitle:
      'Mental health support and sexual/reproductive services for LGBTQ New Yorkers.',
    programProvider: 'NYC Health + Hospitals',
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
        <p>NYC Health + Hospitals is committed to providing culturally competent care to all New Yorkers. The City’s public health system has five designated Pride Health Centers throughout the city, which all offer comprehensive mental health assessments and out-patient care.</p>
        <p>Pride Health Centers can help if you need:</p>
        <div class="list-unordered--check">
        <ul>
        <li><p>urgent sexual or reproductive services</p>

        </li>
        <li><p>LGBTQ affirming care</p>

        </li>
        <li><p>mental health support</p>

        </li>
        </ul>
        </div>
        <br>
        <p>Harm reduction can help prevent problems including acute and chronic infections, and overdose. </p>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>????????</p>
        `,
      },
      cost: {
        title: 'Cost',
        content: `
          <p>??????</p>
        `,
      },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'website',
            body: `
            <h3><a href="https://www.nychealthandhospitals.org/services/lgbtq-health-care-services/">Visit a Pride Health Center</a>. There are five Pride Health Centers in Manhattan and Brooklyn.</h3>
          `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [],
    categories: [
      {
        id: 9,
        name: 'Mental Health Care',
      },
    ],
    population: [
      {
        id: 3,
        name: 'LGBTQ New Yorkers',
      },
    ],
  },
  {
    title: 'Family Counseling',
    subtitle:
      'Counseling with bilingual-bicultural therapists at NYC Health + Hospitals to help you build stronger relationships in your family.',
    programProvider: 'NYC Health + Hospitals',
    sections: ['What it is', 'Who it’s for', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
        <p>Family counseling from a professional mental health provider can help to improve communication, help you and your family members better understand family dynamics, and build stronger relationships with one another.</p>
        <p>NYC Health + Hospitals bilingual-bicultural therapists offer expert counseling in Family Therapy programs. They’re offered at clinics citywide.</p>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>Family counseling is available for all New Yorkers.</p>
        `,
      },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'calling',
            body: `
            <h3><a href="tel:1-844-692-4692">Call 1-844-NYC-4NYC (1-844-692-4692)</a>. to make an appointment or find a clinic near you</h3>
          `,
          },
          {
            type: 'website',
            body: `
            <h3><a href="https://nycwell.cityofnewyork.us/en/find-services/">Search for a provider on NYC Well</a></h3>
            <div class="list-unordered--check">
              <ul>
                <li><p>There are over 600 providers who offer family counseling. </p>

                </li>
                <li><p>Search for “family counseling”</p>

                </li>
              </ul>
            </div>
          `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [],
    categories: [
      {
        id: 8,
        name: 'Counseling',
      },
    ],
    population: [
      {
        id: 2,
        name: 'Families',
      },
    ],
  },
  {
    title: 'Single Point of Access (SPOA)',
    subtitle:
      'Referral to specialty services for people with serious mental illness',
    programProvider: 'Department of Mental Health and Hygiene (DOHMH)',
    sections: ['What it is', 'Who it’s for', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
        <p>The City offers a selection of programs designed to assist New Yorkers experiencing serious mental illness. </p>
        <p>Through <a href="https://www1.nyc.gov/site/doh/providers/resources/mental-illness-single-point-of-access.page" >Single Point of Access (SPOA)</a>, your provider can connect you to specialty mental health services and coordination of care If you have a serious mental illness.</p>
        <p>You’ll need a referral for these services. Your mental health provider — outpatient or inpatient doctor — can start the process of qualifying you for these services.</p>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>Single Point of Access serves New Yorkers of all ages.</p>
        `,
      },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'website',
            body: `
            <h3><strong>If you want a referral to SPOA,</span> contact your mental health provider. </h3>
          `,
          },
          {
            type: 'website',
            body: `
            <h3><strong>If you want to refer someone with a serious mental illness,</span>  complete the online application by logging into <a href="https://a816-healthpsi.nyc.gov/NYCMED/Account/Login" >NYCMED</a>. If you do not have a NYCMED account, you must create one.</h3>
            <p>Your application must include a recent psychiatric evaluation, a recent psychosocial evaluation and a client consent form.</p>
            <p>If you have any questions on how to apply, email <a href="mailto:SPOASupport@health.nyc.gov" >SPOASupport@health.nyc.gov</a></p>
          `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [],
    categories: [
      {
        id: 10,
        name: 'Serious mental illness',
      },
      {
        id: 9,
        name: 'Mental Health Care',
      },
    ],
    population: [
      {
        id: 6,
        name: 'Everyone',
      },
    ],
  },
  {
    title: 'School Mental Health Services',
    subtitle:
      'Mental health resources to meet the emotional health and academic needs of your child.',
    programProvider: 'Department of Education',
    sections: ['What it is', 'Who it’s for', 'Cost', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
        <p>Mental health resources are available to every public school in New York City. The <a href="https://www.schools.nyc.gov/school-life/health-and-wellness/mental-health" >School Mental Health Program</a> offers support so schools meet the emotional health and academic needs of their students.</p>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>Children who attend a NYC DOE public school can get access to services.</p>
        `,
      },
      cost: {
        title: 'Cost',
        content: `
          <p>Although many services are at no cost to families, some services such as treatment may have a fee. Ask your school mental health program for more information.</p>
          <div class="list-unordered--check">
          <ul>
          <li><p>If there is a fee, your current health care insurance may be billed directly.</p>

          </li>
          <li><p>If you do not have insurance, your school mental health program may be able to help you obtain public health insurance.</p>

          </li>
          </ul>
          </div>
          `,
      },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'website',
            body: `
            <h3>Ask your Parent Coordinator, School Social Worker, or School Counselor about your school's mental health program.</h3>
          `,
          },
          {
            type: 'website',
            body: `
            <h3>Visit the DOE website on <a href="https://www.schools.nyc.gov/school-life/health-and-wellness/mental-health" >Mental Health</a> for more information.</h3>
          `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [
      {
        id: 5,
        name: 'Children and Youth',
      },
    ],
    categories: [
      {
        id: 9,
        name: 'Mental Health Care',
      },
    ],
    population: [
      {
        id: 5,
        name: 'Children and Youth',
      },
    ],
  },
  {
    title: 'Assisted Outpatient Treatment (AOT)',
    subtitle:
      'Court-ordered treatment program for those with serious mental illness who are a danger to themselves or others.',
    programProvider: 'Department of Mental Health and Hygiene (DOHMH)',
    sections: ['What it is', 'Who it’s for', 'How to get in touch'],
    body: {
      whatItIs: {
        title: 'What it is',
        content: `
        <p>The Assisted Outpatient Treatment program (AOT) was created by Kendra’s law. Kendra’s law states that people with serious mental illness who are a danger to themselves or others can be court-ordered to participate in mental health treatment.</p>
        <p>If you have a serious mental illness, AOT can help you receive treatment services that may allow you to live independently in your community.</p>
        <p>You might be considered for AOT if someone you know feels it is a challenge for you to live safely or independently in the community without the right mental health treatment, or if previous treatment plans did not work. This person can reach out to the AOT team, who will ask the courts to review your case.</p>
        `,
      },
      whoItIsFor: {
        title: 'Who it’s for',
        content: `
          <p>You can be assigned to the AOT program if you:</p>
          <div class="list-unordered--check">
          <ul>
          <li><p>Are 18 years or older</p>

          </li>
          <li><p>Suffer from a mental illness </p>

          </li>
          <li><p>Have a hard time living independently in your community according to a doctor’s exam </p>

          </li>
          <li><p>Find it difficult to stick to the treatment plan you agreed on with your provider, which has led to: </p>

          </li>
          <ul>
          <li><p>Two psychiatric hospitalizations or incarcerations in the last three years </p>

          </li>
          <li><p>An attempt to hurt yourself or someone else, or having hurt yourself or someone else, at least once in the last four years</p>

          </li>
          </ul>

          </ul>
          </div>
        `,
      },
      howToGetInTouch: {
        title: 'How to get in touch',
        content: [
          {
            type: 'website',
            body: `
            <h3><a href="https://www1.nyc.gov/site/doh/health/health-topics/assisted-outpatient-treatment.page">Learn more about AOT and how to refer someone</a></h3>
            <p>Almost anyone with personal contact with the individual can make a referral. This includes family, roommates, treatment providers, and parole or probation officers.</p>
          `,
          },
        ],
      },
    },
    link: './programs/',
    featured: [],
    categories: [
      {
        id: 9,
        name: 'Mental Health Care',
      },
      {
        id: 10,
        name: 'Serious mental illness',
      },
    ],
    population: [
      {
        id: 6,
        name: 'Everyone',
      },
    ],
  },
];
