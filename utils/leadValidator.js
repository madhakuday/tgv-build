const Lead = require('../models/lead.model');
const Question = require('../models/question.model');

const validateLeadData = async (responses) => {
    const [emailQuestion, phoneQuestion, representedByFirmQuestion] = await Promise.all([
        Question.findOne({ fixedId: 'email' }),
        Question.findOne({ fixedId: 'contact_number' }),
        Question.findOne({ fixedId: 'represented_by_firm_attorney' })
    ]);

    const emailQuestionId = emailQuestion ? emailQuestion._id.toString() : null;
    const phoneQuestionId = phoneQuestion ? phoneQuestion._id.toString() : null;
    const representedByFirmQuestionId = representedByFirmQuestion ? representedByFirmQuestion._id.toString() : null;

    const emailResponse = responses?.find(response => response.questionId === emailQuestionId);
    const phoneResponse = responses?.find(response => response.questionId === phoneQuestionId);
    const representedByFirmResponse = responses?.find(response => response.questionId === representedByFirmQuestionId);

    const representedByFirm = representedByFirmResponse && representedByFirmResponse.response.toLowerCase() === 'yes';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailResponse && !emailRegex.test(emailResponse.response)) {
        throw new Error('Invalid email format');
    }

    const existingLead = await Lead.findOne({
        $or: [
            { 'responses.response': emailResponse?.response, 'responses.questionId': emailQuestionId },
            { 'responses.response': phoneResponse?.response, 'responses.questionId': phoneQuestionId }
        ]
    });

    if (existingLead) {
        return { noIssues: false, error: 'A lead with the same email or phone number already exists.', representedByFirm };
    }

    return { noIssues: true, representedByFirm };
};

module.exports = { validateLeadData };
