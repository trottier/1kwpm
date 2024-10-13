# 1kwpm — experiment with audio filters to increase intelligible listening speed

An advanced web-based audio player designed to improve speech intelligibility at high playback speeds through a suite of customizable audio enhancements.

![Audio Player Screenshot](screenshot.png)

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Audio Enhancements](#audio-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Adjustable Playback Speed**: Play audio files at speeds ranging from 0.5x to 10x.
- **Customizable Audio Enhancements**: Enable, disable, and fine-tune 12 different filters to optimize speech clarity.
- **Real-Time Processing**: All adjustments impact audio playback in real time.
- **Settings Management**: Save and load custom settings for quick access.

## Demo

[View the live demo](https://trottier.github.io/1kwpm/) 

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/trottier/1kwpm.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd 1kwpm
   ```

3. **Open the Application**

   Open `index.html` in your preferred web browser.

## Usage

1. **Load an Audio File**

   - Click the **"Choose File"** button to select an audio file (preferably speech).

2. **Adjust Playback Speed**

   - Use the **"Speed"** slider to set the desired playback rate (0.5x to 10x).

3. **Enable and Configure Audio Enhancements**

   - Each enhancement can be enabled/disabled using the checkbox next to its name.
   - Fine-tune the effect using the provided sliders.
   - The current value of each setting is displayed next to the slider.

4. **Save and Load Settings**

   - Click **"Save Settings"** to store your current configuration in the browser's local storage.
   - Click **"Load Settings"** to retrieve and apply previously saved settings.

## Audio Enhancements

The audio player includes the following filters, ordered by their anticipated impact on intelligibility:

1. ### Noise Reduction

   - **Description**: Reduces background noise to enhance speech clarity by suppressing unwanted ambient sounds.
   - **Controls**:
     - **Reduction Level**: Adjusts the intensity of noise reduction (0% to **200%**).

2. ### Automatic Gain Control (AGC)

   - **Description**: Automatically adjusts the volume to maintain consistent speech levels.
   - **Controls**:
     - **Target Level**: Sets the desired output level (**0.5** to **2.0**).

3. ### Dynamic Range Compression

   - **Description**: Balances audio levels to make softer sounds more audible without distorting louder sounds.
   - **Controls**:
     - **Threshold**: The level above which compression begins (**-100 dB** to **0 dB**).
     - **Ratio**: The amount of compression applied (**1:1** to **20:1**).

4. ### Phase Vocoder (Time-Stretching)

   - **Description**: Advanced time-stretching that preserves the pitch and quality of speech even at high playback speeds.
   - **Controls**:
     - **Time Stretch Factor**: Adjusts the amount of time-stretching (**0.5** to **2.0**).

5. ### Formant Preservation

   - **Description**: Maintains the natural formant frequencies of speech when adjusting playback speed to prevent unnatural sounding speech.
   - **Controls**:
     - **Preservation Level**: Sets the degree of formant preservation (**0.5** to **2.0**).

6. ### Temporal Smoothing

   - **Description**: Reduces rapid fluctuations in the audio signal to create a smoother listening experience at high speeds.
   - **Controls**:
     - **Smoothing Level**: Adjusts the amount of smoothing applied (0% to **200%**).

7. ### Dynamic Equalization

   - **Description**: Automatically adjusts equalizer settings in real-time based on the audio content to enhance critical speech frequencies dynamically.
   - **Controls**:
     - **EQ Intensity**: Sets the intensity of dynamic equalization (**0.5** to **2.0**).

8. ### Spectral Shaping (Formant Enhancement)

   - **Description**: Enhances critical speech frequencies, making speech sounds more distinct.
   - **Controls**:
     - **Enhancement Level**: Adjusts the amount of spectral shaping (**0.5** to **4.0**).

9. ### Consonant Emphasis

   - **Description**: Enhances clarity by emphasizing consonant sounds using a peaking filter.
   - **Controls**:
     - **Frequency**: Sets the target frequency for emphasis (**1000 Hz** to **5000 Hz**).
     - **Gain**: Adjusts the gain applied at the target frequency (**0 dB** to **20 dB**).

10. ### Frequency Compression

    - **Description**: Compresses the frequency spectrum to bring critical speech frequencies closer together.
    - **Controls**:
      - **Compression Level**: Adjusts the amount of frequency compression (**0.5** to **4.0**).

11. ### Transient Enhancement

    - **Description**: Enhances transient elements of speech, such as plosives and consonants, to make speech clearer.
    - **Controls**:
      - **Enhancement Level**: Sets the intensity of transient enhancement (**0.5** to **2.0**).

12. ### Psychoacoustic Modeling

    - **Description**: Applies processing based on human auditory perception to enhance important speech components.
    - **Controls**:
      - **Modeling Intensity**: Adjusts the level of psychoacoustic modeling (**0.5** to **2.0**).


## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- **Web Audio API**: For providing the tools to process audio in the browser.
- **OpenAI's GPT-4**: Assistance in generating code and documentation.

---

*Note: Some advanced audio processing features like the Phase Vocoder and Formant Preservation are simplified due to the limitations of the Web Audio API. Future enhancements may involve integrating external libraries or custom audio processing to achieve more accurate implementations.*

---

- **Update the live demo link** once the project is hosted.
