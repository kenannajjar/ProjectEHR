/*SAMPLE OUTPUT for search term: Aspirin

Format is as follows 
id: This is the SX_RXCUI which is unique for each Name+Route combination of a drug on the RxTerms database.
name: Name of drug
fields.dose: The dose of the drug is returned in the same order as the corresponding route list
fields.route: The route of the drug
fields.frequency: placeholder
fields.refills: placeholder

[
  {
    "id": [
      "1154070",
      "1294937",
      "1154071"
    ],
    "name": "Aspirin",
    "fields": {
      "dose": [
        [
          " 81 mg Cap",
          " 81 mg DR Tab",
          " 81 mg Tab",
          "325 mg Cap",
          "325 mg DR Tab",
          "325 mg Tab",
          "500 mg DR Tab",
          "500 mg Tab",
          "650 mg DR Tab",
          "650 mg Tab"
        ],
        [
          "81 mg Tab"
        ],
        [
          "300 mg Suppository",
          "600 mg Suppository"
        ]
      ],
      "route": [
        "Oral Pill",
        "Chewable",
        "Rectal"
      ],
      "frequency": "string",
      "refills": 0
    }
  },*/
export async function getRxTerms(searchTerm) {
    try {
        const rxtermsApiUrl = `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${searchTerm}&ef=STRENGTHS_AND_FORMS,RXCUIS`;
        const rxtermsResponse = await fetch(rxtermsApiUrl);

        const rxtermsData = await rxtermsResponse.json();
        
        results = formatRxTerms(rxtermsData);

        return results;
    } catch (error) {
        throw error;
    }
}

function formatRxTerms(data) {
     const formattedResult = new Map()

    data[1].forEach((drug, index) => {
        const drugAndRoute = drug.split(/\s+\(|\)\s*/);;
        
        const name = drugAndRoute[0];
        const route = drugAndRoute[1];

        const id = data[2]["SXDG_RXCUI"][index];
        const dose = data[2]["STRENGTHS_AND_FORMS"][index];
        const frequency = "string"; // Set frequency as needed
        const refills = 0; // Set refills as needed

        if (formattedResult.has(name)){
            entry = formattedResult.get(name);
            entry.id.push(id);
            entry.fields.dose.push(dose);
            entry.fields.route.push(route.replace(")", ""));
        }else{
           const formattedEntry = {
            id: [id],
            name,
            fields: {
                dose: [dose],
                route: [route],
                frequency,
                refills,
            },
            };


            formattedResult.set(name,formattedEntry);
        }

    });

    return Array.from(formattedResult.values());;
}

