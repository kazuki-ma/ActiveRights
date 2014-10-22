namespace ActiveRights
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public class ACEApproval : DbContext
    {
        // コンテキストは、アプリケーションの構成ファイル (App.config または Web.config) から 'ACEApproval' 
        // 接続文字列を使用するように構成されています。既定では、この接続文字列は LocalDb インスタンス上
        // の 'ActiveRights.ACEApproval' データベースを対象としています。 
        // 
        // 別のデータベースとデータベース プロバイダーまたはそのいずれかを対象とする場合は、
        // アプリケーション構成ファイルで 'ACEApproval' 接続文字列を変更してください。
        public ACEApproval()
            : base("name=ACEApproval")
        {
        }

        // モデルに含めるエンティティ型ごとに DbSet を追加します。Code First モデルの構成および使用の
        // 詳細については、http://go.microsoft.com/fwlink/?LinkId=390109 を参照してください。

         public virtual DbSet<Models.Ace> Aces { get; set; }
         public virtual DbSet<Folder> Folders { get; set; }
    }

    public class Folder
    {
        //[Key]
        [Key]
        public string Unc { get; set; }
        public string Owner { get; set; }
        public Boolean AreAccessRulesProtected { get; set; }
    }
}