const skipTraceBtn = document.querySelector('.skiptrace');
const generateCsvBtn = document.querySelector('.generate-csv');
const formSubmit = document.querySelector('form');

formSubmit.addEventListener('submit', async (event) => {
  event.preventDefault();
  //elements
  const csvFileInput = document.querySelector('#csvfile');
  const leadsCount = document.querySelector('.leads-count');

  const url = '/upload';
  const formData = new FormData(formSubmit);
  csvFileInput.value = '';

  // const file = formData.get('csvfile');
  try {
    const fileUploadResults = await postData(url, formData);

    if (fileUploadResults.status === 200) {
      console.log(JSON.stringify(fileUploadResults));
      leadsCount.innerHTML = Number(fileUploadResults.totalRecords);
    }
  } catch (error) {
    console.log(error.message);
  }
});

skipTraceBtn.addEventListener('click', async () => {
  const url = '/skip-data';
  try {
    const data = await fetchData(url);
    if (data) {
      console.log(JSON.stringify(data));
    } else {
      throw new Error('fetchData failed');
    }
  } catch (error) {
    console.log(`Error no data fetched: ${error} with ${error.message}`);
  }
});

generateCsvBtn.addEventListener('click', () => {
  console.log('generate csv click');
});

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`fetch to ${url} failed`);
    }
    return response.json();
  } catch (error) {
    console.log(`fetchData function failed: ${error.message}`);
  }
}

async function postData(url, data) {
  const response = await fetch(url, {
    method: 'post',
    body: data,
  });
  return response.json();
}
