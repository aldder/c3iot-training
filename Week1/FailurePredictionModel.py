# 1. Model training
X_y_train = train_data['NumberOfSwitches','DurationOn','Defect']
untrained_model = LogisticRegression()
trained_model = c3.PythonMachineLearningClassifier.train(untraned_model, X_y_train, 'Defect')

# 2. Model prediction
X_test = test_data['NumberOfSwitches','DurationOn']
predictions = c3.PythonMachineLearningClassifier.predict(trained_model, X_test)

# 3. Model evaluation
actual_outcome = test_data['Defect']
accuracy_score = accuracy_score(actual_outcome, predictions)