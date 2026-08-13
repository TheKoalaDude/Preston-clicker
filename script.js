* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    min-height: 100vh;
    font-family: Arial, Helvetica, sans-serif;
    overflow-x: hidden;
    color: white;
}

.background {
    position: fixed;
    inset: 0;

    background-image: url("https://images.socialblade.com/3840x,q75/https://yt3.googleusercontent.com/jGNlvFjk5j5WVpx9nlHIRpRPPlHVVeeTVWZZELDs9cfiHjY2_FI4C6C7cuF92KUQPkfk55E1Hg=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj");

    background-size: cover;
    background-position: center;
    z-index: -2;
}

.background::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
}

.profile {
    position: absolute;
    top: 25px;
    left: 30px;

    display: flex;
    align-items: center;
    gap: 12px;

    font-size: 26px;
    font-weight: bold;
}

.profile-circle {
    width: 55px;
    height: 55px;

    border-radius: 50%;
    overflow: hidden;

    background: white;
}

.profile-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.global {
    position: absolute;
    top: 30px;
    right: 35px;

    display: flex;
    align-items: center;
    gap: 12px;

    font-size: 24px;
    font-weight: bold;
}

.global-circle {
    width: 28px;
    height: 28px;

    border-radius: 50%;
    background: #e7d7bd;
}

h1 {
    text-align: center;
    padding-top: 105px;
    font-size: 38px;
    font-weight: bold;
}

.panel {
    width: 65%;
    min-height: 650px;

    margin: 25px auto 50px;

    background: rgba(0, 0, 0, 0.35);

    border-radius: 30px;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 45px 30px;
}

#counter {
    font-size: clamp(55px, 8vw, 110px);
    font-weight: bold;
    margin-bottom: 30px;

    text-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

#clickButton {
    width: 220px;
    height: 220px;

    border-radius: 50%;
    border: 8px solid #ff8a00;

    cursor: pointer;

    background:
        radial-gradient(circle, #ffcc00 0%, #ff6a00 45%, #e22b00 75%, #8f1600 100%);

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow:
        0 0 25px rgba(255, 115, 0, 0.8),
        0 0 60px rgba(255, 70, 0, 0.5);

    transition: transform 0.08s;
}

#clickButton:hover {
    transform: scale(1.05);
}

#clickButton:active {
    transform: scale(0.94);
}

#clickButton img {
    width: 105px;
    height: 105px;

    object-fit: cover;
    border-radius: 50%;
}

.stats {
    display: flex;
    gap: 55px;

    margin-top: 35px;

    color: #42ff5a;

    font-size: 28px;
    font-weight: bold;
}

.stats small {
    font-size: 18px;
}

.goal {
    width: 80%;
    margin-top: 45px;
}

.goal-title {
    font-size: 28px;
    font-weight: bold;
    color: #f6cf67;
}

.goal-title strong {
    margin-left: 10px;
}

.remaining {
    margin-top: 8px;
    color: #999186;
    font-size: 20px;
}

.progress-container {
    width: 100%;
    height: 16px;

    margin-top: 15px;

    border-radius: 20px;

    background: rgba(255, 255, 255, 0.15);

    overflow: hidden;
}

.progress {
    width: 0%;
    height: 100%;

    background: #f6cf67;

    border-radius: 20px;

    transition: width 0.3s;
}

@media (max-width: 700px) {

    .panel {
        width: 92%;
    }

    h1 {
        font-size: 27px;
    }

    .profile {
        left: 15px;
        font-size: 20px;
    }

    .global {
        right: 15px;
        font-size: 18px;
    }

    #clickButton {
        width: 170px;
        height: 170px;
    }

    #clickButton img {
        width: 80px;
        height: 80px;
    }

    .stats {
        gap: 20px;
        font-size: 21px;
    }

    .goal {
        width: 95%;
    }
}
