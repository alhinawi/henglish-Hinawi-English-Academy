// Original optional fictional language practice, not professional advice.
export const SCENARIO_VARIATION_CHECKS: Record<string, readonly (readonly [string,string])[]> = {
  "sim-airport-checkin": [
    [
      "I asked which other seats are available.",
      "I named my preferred option and gave a reason."
    ],
    [
      "I asked for the baggage instructions to be repeated.",
      "I checked where I should go next."
    ],
    [
      "I asked how to reach the correct check-in desk.",
      "I checked a landmark to confirm I understood the directions."
    ],
    [
      "I asked where to take my bag after check-in.",
      "I checked whether I needed to join a different queue."
    ]
  ],
  "sim-restaurant-ordering": [
    [
      "I asked about an alternative dish.",
      "I asked what ingredients it contains."
    ],
    [
      "I identified the item I did not order.",
      "I politely asked the server to check the bill."
    ],
    [
      "I asked whether separate payment was possible.",
      "I explained how our fictional group wanted to divide the bill."
    ],
    [
      "I politely asked for more time to choose.",
      "I suggested when the server could return."
    ]
  ],
  "sim-doctor-appointment": [
    [
      "I asked for a simple explanation of the unfamiliar term.",
      "I checked my understanding in my own words."
    ],
    [
      "I added when the imaginary symptom began.",
      "I asked whether any more information was needed."
    ],
    [
      "I asked the receptionist how to arrange a follow-up.",
      "I checked what I would need to bring to the fictional appointment."
    ],
    [
      "I asked whether an interpreter was available.",
      "I identified the part of my invented description that needed language help."
    ]
  ],
  "sim-job-interview": [
    [
      "I honestly named a skill my fictional applicant is developing.",
      "I gave an invented example of how the applicant is improving."
    ],
    [
      "I asked what the unclear interview question meant.",
      "I gave an example relevant to the clarified question."
    ],
    [
      "I asked about a responsibility of the fictional role.",
      "I asked about a detail of the next interview stage."
    ],
    [
      "I politely asked for a moment to think.",
      "I identified the kind of relevant example I was considering."
    ]
  ],
  "sim-coffee-shop": [
    [
      "I asked which other drink was available.",
      "I confirmed the size and price."
    ],
    [
      "I explained that I ordered an iced drink but received a hot one.",
      "I politely asked the barista to check the order."
    ],
    [
      "I explained that I wanted the order to take away.",
      "I asked whether the packaging would cost extra."
    ],
    [
      "I asked whether the order would be brought to my table.",
      "I checked how I would know when the order was ready."
    ]
  ],
  "sim-hotel-checkin": [
    [
      "I asked when the imaginary room might be ready.",
      "I asked whether I could leave my bags somewhere."
    ],
    [
      "I explained that I would prefer a quiet room.",
      "I asked whether changing rooms would cost extra."
    ],
    [
      "I asked about checking out before reception opens.",
      "I confirmed where I should leave the fictional room key."
    ],
    [
      "I explained that the fictional room key would not open the door.",
      "I asked what reception needed to check before helping."
    ]
  ],
  "sim-pharmacy-visit": [
    [
      "I identified the part of the imaginary label I could not read.",
      "I asked the pharmacist to explain it rather than guessing."
    ],
    [
      "I asked the pharmacist to check the unclear instruction.",
      "I repeated the explanation in my own words to check it."
    ],
    [
      "I asked the pharmacist to speak more slowly.",
      "I asked for a written instruction to review with the pharmacist, not to guess."
    ],
    [
      "I described the difference between the invented label and explanation.",
      "I asked the pharmacist to check before following either version, rather than guessing."
    ]
  ],
  "sim-clothing-shopping": [
    [
      "I asked about another size or a similar item.",
      "I checked the price of the alternative item."
    ],
    [
      "I asked about the return policy before deciding.",
      "I checked a specific return condition instead of assuming it."
    ],
    [
      "I asked where the fitting rooms were.",
      "I checked how many items I could take into a fitting room."
    ],
    [
      "I asked about a difference between two items.",
      "I explained what mattered most to me without claiming I had decided to buy."
    ]
  ],
  "sim-supermarket-shopping": [
    [
      "I asked a staff member where to find the item.",
      "I checked one detail of the directions."
    ],
    [
      "I explained the difference between the shelf and checkout prices.",
      "I asked the cashier to check the price before payment."
    ],
    [
      "I asked whether help with heavy shopping was available.",
      "I confirmed where I should wait for that assistance."
    ],
    [
      "I politely identified the item to remove before payment.",
      "I asked the cashier to confirm the updated total."
    ]
  ]
};
