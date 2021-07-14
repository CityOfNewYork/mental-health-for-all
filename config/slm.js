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
      featured: true,
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
      featured: true,
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
      featured: true,
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
      featured: true,
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
      programProvider:
        "Mayor's Office to End Domestic and Gender-Based Violence",
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
      featured: true,
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
          name: 'Children and Families',
        },
        {
          id: 8,
          name: 'Adults',
        },
        {
          id: 3,
          name: 'LGBTQ',
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
      featured: true,
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
      featured: true,
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
      featured: true,
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
          name: 'Children and Families',
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
      featured: true,
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
      featured: true,
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
          name: 'Children and Families',
        },
      ],
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
      name: 'Children and Families',
      slug: 'children-and-families',
    },
    {
      id: 3,
      name: 'LGBTQ',
      slug: 'lgntq',
    },
    {
      id: 4,
      name: 'Seniors',
      slug: 'seniors',
    },
    {
      id: 5,
      name: 'Students',
      slug: 'students',
    },
    {
      id: 6,
      name: 'Everyone',
      slug: 'everyone',
    },
    {
      id: 7,
      name: 'Immigrants',
      slug: 'immigrants',
    },
    {
      id: 8,
      name: 'Adults',
      slug: 'adults',
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
  generateClassName: (title) => {
    let className = `bg-${title.toLowerCase()}--secondary`;
    return className;
  },
  createSlug: (s) =>
    s
      .toLowerCase()
      .replace(/[^0-9a-zA-Z - _]+/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-'),
};
