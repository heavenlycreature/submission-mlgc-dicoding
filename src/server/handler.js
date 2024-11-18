const predictClassification = require("../inference/inferenceService");
const crypto = require('crypto');
const { storeData, getData } = require("../inference/database");

async function postPredictHandler(req, h) {
    const { image } = req.payload;
    const { model } = req.server.app;

    const  { label, suggestion, confidenceScore} = await predictClassification(model, image);
    
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        'id': id,
        'result': label,
        'suggestion': suggestion,
        'createdAt': createdAt,
    }

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message:  confidenceScore > 0 ? 'Model is predicted successfully' : 'Model is predicted successfully but under threshold. please use the correct picture',
        data,
    });
    response.code(201);
    return response;
}

async function getAllDataPredictionHandler(req, h) {
    const { id } = req.params;

	const data = await getData(id);

	if (!data) {
		const response = h.response({
			status: "fail",
			message: "data not found",
		});
		response.code(404);
		return response;
	}

	const response = h.response({
		status: "success",
		data,
	});
	response.code(200);
	return response;
  }
module.exports = {postPredictHandler, getAllDataPredictionHandler};