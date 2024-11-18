const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: 'submissionmlgc-leping'
});

function model(doc) {
	return {
		id: doc.id,
		history: {
			result: doc.data().result,
			createdAt: doc.data().createdAt,
			suggestion: doc.data().suggestion,
			id: doc.id,
		},
	};
}

async function storeData(id, data) {
    const predictCollection = db.collection('predictions');
    return predictCollection.doc(id).set(data);
}
async function getData(id) {
    const predictCollection = db.collection('predictions');
    if (id) {
		const doc = await predictCollection.doc(id).get();
		if (!doc.exists) return null;
		return model(doc);
	} else {
		const snapshot = await predictCollection.get();
		const data = [];
		snapshot.forEach(doc => data.push(model(doc)));
		return data;
	}
}
module.exports = { storeData, getData, model };