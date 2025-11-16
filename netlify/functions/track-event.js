exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);

    // NO expongas este secret en el frontend jamás
    const MEASUREMENT_ID = "G-0G3Q7PGYFP";
    const API_SECRET = "-R-CJd0lS8WWKMlOpyv97Q";

    const gaUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;

    // Si no viene client_id desde el frontend, generamos uno random
    const clientId = body.client_id || "cid-" + Math.random().toString(36).substring(2) + Date.now();

    const payload = {
      client_id: clientId,
      events: [
        {
          name: body.event_name,
          params: body.params || {}
        }
      ]
    };

    const res = await fetch(gaUrl, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
