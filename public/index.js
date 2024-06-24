const skipTraceBtn = document.querySelector('.skiptrace');
const generateCsvBtn = document.querySelector('.generate-csv');
const formSubmit = document.querySelector('form');

async function postData(url, data) {
  if (!data) {
    throw new Error(`No Data: ${data} Provided.`);
  }
  try {
    const response = await fetch(url, {
      method: 'post',
      body: data,
    });
    if (!response.ok) {
      throw new Error(`POST to ${url} Failed.`);
    }
    return response.json();
  } catch (error) {
    console.log(error, error.message);
  }
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`FETCH to URL: ${url} Failed`);
    }
    return response.json();
  } catch (error) {
    console.log(`FetchData function failed: ${error.message}`);
  }
}

formSubmit.addEventListener('submit', async (event) => {
  event.preventDefault();
  //elements
  // const csvFileInput = document.querySelector('#csvfile');
  const leadsCount = document.querySelector('.leads-count');

  const url = '/upload';
  const formData = new FormData(formSubmit);
  // formData.append('csvfile', csvFileInput.files[0]);

  const response = await postData(url, formData);
  leadsCount.innerHTML = Number(response.totalRecords);
  console.log(response);
});

skipTraceBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  const skipTotal = document.querySelector('.skip-total');
  const url = '/skip-data';
  try {
    const data = await fetchData(url);
    if (data) {
      skipTotal.innerHTML = data.totalRecords;
      console.log(data);
    } else {
      throw new Error('fetchData failed');
    }
  } catch (error) {
    console.log(`Error no data fetched: with ${error.message}`);
  }
});

generateCsvBtn.addEventListener('click', async () => {
  const url = '/generate-csv';
  const response = await fetch(url);
  return response.json();
});
