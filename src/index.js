// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

// function getLearnerData(course, ag, submissions) {
//   // here, we would process this data to achieve the desired result.
//   const result = [
//     {
//       id: 125,
//       avg: 0.985, // (47 + 150) / (50 + 150)
//       1: 0.94, // 47 / 50
//       2: 1.0, // 150 / 150
//     },
//     {
//       id: 132,
//       avg: 0.82, // (39 + 125) / (50 + 150)
//       1: 0.78, // 39 / 50
//       2: 0.833, // late: (140 - 15) / 150
//     },
//   ];

//   return result;
// }

// const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

// console.log(result);

function getLearnerData(course, ag, submissions) {
  try {
    // Validate course and assignment group match
    if (ag.course_id !== course.id) {
      throw new Error(
        `AssignmentGroup with ID ${ag.id} does not belong to Course ID ${course.id}`
      );
    }

    const now = new Date();
    const learnerResults = {};

    // Iterate through learner submissions
    submissions.forEach((submission) => {
      const {
        learner_id,
        assignment_id,
        submission: submissionData,
      } = submission;

      // Find the corresponding assignment
      const assignment = ag.assignments.find((a) => a.id === assignment_id);

      if (!assignment) {
        throw new Error(
          `Assignment ID ${assignment_id} not found in AssignmentGroup.`
        );
      }

      // Skip assignments not yet due
      const dueDate = new Date(assignment.due_at);
      if (dueDate > now) return;

      const pointsPossible = assignment.points_possible;

      // Validate points_possible is non-zero
      if (pointsPossible === 0) {
        throw new Error(
          `Assignment ID ${assignment_id} has 0 possible points.`
        );
      }

      // Calculate score with potential late penalty
      const latePenalty =
        new Date(submissionData.submitted_at) > dueDate
          ? 0.1 * pointsPossible
          : 0;
      const adjustedScore = Math.max(submissionData.score - latePenalty, 0);
      const percentage = adjustedScore / pointsPossible;

      // Initialize learner results if not already present
      if (!learnerResults[learner_id]) {
        learnerResults[learner_id] = {
          id: learner_id,
          avg: 0,
          totalPoints: 0,
          totalPossible: 0,
        };
      }

      const learner = learnerResults[learner_id];
      learner[assignment_id] = percentage; // Add assignment percentage
      learner.totalPoints += adjustedScore; // Add to total points scored
      learner.totalPossible += pointsPossible; // Add to total points possible
    });

    // Calculate final averages
    return Object.values(learnerResults).map((learner) => {
      learner.avg = learner.totalPoints / learner.totalPossible;
      delete learner.totalPoints;
      delete learner.totalPossible;
      return learner;
    });
  } catch (error) {
    console.error("Error processing data:", error.message);
    return [];
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
