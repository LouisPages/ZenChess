import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D

X = np.load('zenbot/eval_nn/saved-data/X_data.npy')

Y_raw = np.load('zenbot/eval_nn/saved-data/Y_data.npy')
Y_mean = Y_raw.mean()
Y_std = Y_raw.std()
Y = (Y_raw - Y_mean) / Y_std
np.save('zenbot/eval_nn/saved-data/Y_mean.npy', Y_mean)
np.save('zenbot/eval_nn/saved-data/Y_std.npy', Y_std)

n_samples = X.shape[0]
train_samples = int(0.9 * n_samples)
X_train, X_test = X[:train_samples], X[train_samples:]
Y_train, Y_test = Y[:train_samples], Y[train_samples:]

model = Sequential()
model.add(Conv2D(32, kernel_size = (3,3), activation='relu', padding='same', input_shape=(17,8,8)))
model.add(Conv2D(64, kernel_size=(3,3), activation='relu', padding='same'))
model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dropout(rate=0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(rate=0.5))
model.add(Dense(1, activation='tanh'))

model.compile(optimizer='adam', loss='mse', metrics=['mae'])

model.summary()

history = model.fit(X_train, Y_train, validation_data=(X_test, Y_test), epochs=100, batch_size=16, verbose=1)

model.save('zenbot/eval_nn/saved-data/chess_eval_model.keras')

test_loss, test_mae = model.evaluate(X_test, Y_test)
print(f'\nTest Loss: {test_loss:.4f}')
print(f'Test MAE: {test_mae:.4f}')