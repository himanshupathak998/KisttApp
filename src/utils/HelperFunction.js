class HelperFunction {
    static generateXCorrelationId() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 16; i++) {
            const randomIndex = Math.floor(Math.random() * chars?.length);
            result += chars[randomIndex];
        }
        return result;
    }
}

export default HelperFunction;