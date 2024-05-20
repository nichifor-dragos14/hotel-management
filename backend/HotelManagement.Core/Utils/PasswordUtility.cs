using System.Security.Cryptography;
using System.Text;

namespace HotelManagement.Core.Utils;

public static class PasswordUtility
{
    private static readonly byte[] Key;
    private static readonly byte[] IV;

    static PasswordUtility()
    {

        Key = Encoding.UTF8.GetBytes("thisisaverysecurekey32byteslong!");
        IV = Encoding.UTF8.GetBytes("thisisa16byteiv!");
    }

    public static string EncryptPassword(string password)
    {
        using (Aes aesAlg = Aes.Create())
        {
            aesAlg.Key = Key;
            aesAlg.IV = IV;

            ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

            using (MemoryStream msEncrypt = new MemoryStream())
            {
                using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                {
                    using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                    {
                        swEncrypt.Write(password);
                    }
                }

                byte[] encryptedContent = msEncrypt.ToArray();
                return Convert.ToBase64String(encryptedContent);
            }
        }
    }

    public static string DecryptPassword(string encryptedPassword)
    {
        byte[] fullCipher = Convert.FromBase64String(encryptedPassword);

        using (Aes aesAlg = Aes.Create())
        {
            aesAlg.Key = Key;
            aesAlg.IV = IV;

            ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

            using (MemoryStream msDecrypt = new MemoryStream(fullCipher))
            {
                using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                {
                    using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                    {
                        return srDecrypt.ReadToEnd();
                    }
                }
            }
        }
    }
}